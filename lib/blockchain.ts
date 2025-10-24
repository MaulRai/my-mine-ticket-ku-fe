import { ethers } from 'ethers';

const EVENT_CHAIN_ABI = [
  "function buyTickets(uint256 eventId, uint256 typeId, uint256 quantity, address[] beneficiaries, uint256[] percentages) external payable returns (uint256[])",
  "function listTicketForResale(uint256 ticketId, uint256 resalePrice, uint256 resaleDeadline) external",
  "function buyResaleTicket(uint256 ticketId) external payable",
  "function getTicketDetails(uint256 ticketId) external view returns (tuple(uint256 ticketId, uint256 eventId, uint256 typeId, address currentOwner, uint256 originalPrice, bool isUsed, uint256 mintedAt, uint256 usedAt, bool isForResale, uint256 resalePrice, uint256 resaleDeadline, uint8 resaleCount))",
  "function getUserTickets(address user) external view returns (uint256[])",
  "function canResell(uint256 ticketId) external view returns (bool)",
  "function getMaxResalePrice(uint256 ticketId) external view returns (uint256)"
];

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;
  private isConnecting: boolean = false;

  async connectWallet(): Promise<string> {
    if (this.isConnecting) {
      throw new Error('Connection already in progress');
    }

    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not installed. Please install MetaMask to continue.');
    }

    try {
      this.isConnecting = true;
      
      this.disconnect();
      
      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      const accounts = await this.provider.send('eth_requestAccounts', []);
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, EVENT_CHAIN_ABI, this.signer);

      return accounts[0];
    } catch (error: any) {
      this.disconnect();
      console.error('Error connecting wallet:', error);
      
      if (error.code === 4001) {
        throw new Error('Connection request rejected by user');
      }
      
      throw new Error(error.message || 'Failed to connect wallet');
    } finally {
      this.isConnecting = false;
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('No signer available. Please connect wallet first.');
    }

    try {
      const signature = await this.signer.signMessage(message);
      return signature;
    } catch (error: any) {
      console.error('Error signing message:', error);
      
      if (error.code === 4001) {
        throw new Error('Signature request rejected by user');
      }
      
      throw new Error(error.message || 'Failed to sign message');
    }
  }

  disconnect() {
    this.provider = null;
    this.contract = null;
    this.signer = null;
  }

  async getContract() {
    if (!this.contract || !this.signer) {
      throw new Error('Wallet not connected. Please connect wallet first.');
    }
    return this.contract;
  }

  async getCurrentAccount(): Promise<string | null> {
    if (!this.provider) {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          this.provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await this.provider.send('eth_accounts', []);
          if (accounts.length > 0) {
            this.signer = await this.provider.getSigner();
            this.contract = new ethers.Contract(CONTRACT_ADDRESS, EVENT_CHAIN_ABI, this.signer);
            return accounts[0];
          }
        } catch (error) {
          console.error('Error reconnecting:', error);
        }
      }
      return null;
    }
    
    try {
      const signer = await this.provider.getSigner();
      return signer.address;
    } catch {
      return null;
    }
  }

  async buyTickets(
    eventId: number, 
    typeId: number, 
    quantity: number, 
    beneficiaries: string[],
    percentages: number[],
    totalPrice: string
  ) {
    const contract = await this.getContract();
    const totalCost = ethers.parseEther(totalPrice);
    
    const tx = await contract.buyTickets(
      eventId, 
      typeId, 
      quantity,
      beneficiaries,
      percentages,
      { value: totalCost }
    );
    
    const receipt = await tx.wait();
    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      ticketIds: receipt.logs
        .filter((log: any) => log.topics[0] === ethers.id('TicketMinted(uint256,uint256,uint256,address,uint256)'))
        .map((log: any) => Number(ethers.getBigInt(log.topics[1])))
    };
  }

  async listTicketForResale(ticketId: number, resalePrice: string, resaleDeadline: number) {
    const contract = await this.getContract();
    const priceInWei = ethers.parseEther(resalePrice);
    
    const tx = await contract.listTicketForResale(ticketId, priceInWei, resaleDeadline);
    const receipt = await tx.wait();
    
    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  }

  async buyResaleTicket(ticketId: number, price: string) {
    const contract = await this.getContract();
    const priceInWei = ethers.parseEther(price);
    
    const tx = await contract.buyResaleTicket(ticketId, {
      value: priceInWei
    });
    
    const receipt = await tx.wait();
    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  }

  async getUserTickets(address: string): Promise<number[]> {
    const contract = await this.getContract();
    const ticketIds = await contract.getUserTickets(address);
    return ticketIds.map((id: bigint) => Number(id));
  }

  async getTicketDetails(ticketId: number) {
    const contract = await this.getContract();
    const ticket = await contract.getTicketDetails(ticketId);
    
    return {
      ticketId: Number(ticket.ticketId),
      eventId: Number(ticket.eventId),
      typeId: Number(ticket.typeId),
      currentOwner: ticket.currentOwner,
      originalPrice: ethers.formatEther(ticket.originalPrice),
      isUsed: ticket.isUsed,
      mintedAt: Number(ticket.mintedAt),
      usedAt: Number(ticket.usedAt),
      isForResale: ticket.isForResale,
      resalePrice: ethers.formatEther(ticket.resalePrice),
      resaleDeadline: Number(ticket.resaleDeadline),
      resaleCount: Number(ticket.resaleCount)
    };
  }

  async canResell(ticketId: number): Promise<boolean> {
    const contract = await this.getContract();
    return await contract.canResell(ticketId);
  }

  async getMaxResalePrice(ticketId: number): Promise<string> {
    const contract = await this.getContract();
    const maxPrice = await contract.getMaxResalePrice(ticketId);
    return ethers.formatEther(maxPrice);
  }
}

export const blockchainService = new BlockchainService();

declare global {
  interface Window {
    ethereum?: any;
  }
}