"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Users, 
  Ticket, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Loader2
} from "lucide-react"
import { apiClient, type Proposal, type AdminStats } from "@/lib/api"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [eos, setEos] = useState<any[]>([])
  const [processingProposal, setProcessingProposal] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      // Verify token and check if user is admin
      const { user } = await apiClient.verifyToken()
      
      if (user.role !== 'ADMIN') {
        router.push('/events')
        return
      }

      await Promise.all([
        fetchStats(),
        fetchProposals(),
        fetchEOs()
      ])
    } catch (err: any) {
      console.error('Admin access error:', err)
      setError(err.message)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await apiClient.getAdminStats()
      setStats(data)
    } catch (err: any) {
      console.error('Error fetching stats:', err)
    }
  }

  const fetchProposals = async () => {
    try {
      const data = await apiClient.getPendingProposals()
      setProposals(data)
    } catch (err: any) {
      console.error('Error fetching proposals:', err)
    }
  }

  const fetchEOs = async () => {
    try {
      const data = await apiClient.getEventOrganizers()
      setEos(data)
    } catch (err: any) {
      console.error('Error fetching EOs:', err)
    }
  }

  const handleApproveProposal = async (proposalId: string, taxWallet: string) => {
    try {
      setProcessingProposal(proposalId)
      await apiClient.approveProposal(proposalId, { 
        taxWalletAddress: taxWallet,
        adminComment: 'Approved by admin'
      })
      
      // Refresh proposals
      await fetchProposals()
      await fetchStats()
    } catch (err: any) {
      console.error('Error approving proposal:', err)
      alert(err.message || 'Failed to approve proposal')
    } finally {
      setProcessingProposal(null)
    }
  }

  const handleRejectProposal = async (proposalId: string, reason: string) => {
    try {
      setProcessingProposal(proposalId)
      await apiClient.rejectProposal(proposalId, reason || 'Rejected by admin')
      
      await fetchProposals()
      await fetchStats()
    } catch (err: any) {
      console.error('Error rejecting proposal:', err)
      alert(err.message || 'Failed to reject proposal')
    } finally {
      setProcessingProposal(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatEther = (wei: string) => {
    try {
      return (parseFloat(wei) / 1e18).toFixed(4)
    } catch {
      return '0.0000'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-12 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-heading text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400 font-body">Manage events, proposals, and platform statistics</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 font-body text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-body text-sm mb-1">Total Events</p>
                  <p className="text-3xl font-heading text-white">{stats?.totalEvents || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-body text-sm mb-1">Active Events</p>
                  <p className="text-3xl font-heading text-white">{stats?.activeEvents || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-body text-sm mb-1">Tickets Sold</p>
                  <p className="text-3xl font-heading text-white">{stats?.totalTicketsSold || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Ticket className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 font-body text-sm mb-1">Total Revenue</p>
                  <p className="text-2xl font-heading text-white">{formatEther(stats?.totalRevenue || '0')} ETH</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="proposals" className="space-y-6">
          <TabsList className="bg-gray-900/60 border border-white/10">
            <TabsTrigger value="proposals">
              Pending Proposals ({proposals.length})
            </TabsTrigger>
            <TabsTrigger value="eos">
              Event Organizers ({eos.length})
            </TabsTrigger>
            <TabsTrigger value="transactions">
              Recent Transactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="proposals" className="space-y-4">
            {proposals.length === 0 ? (
              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
                <CardContent className="p-12 text-center">
                  <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-body">No pending proposals</p>
                </CardContent>
              </Card>
            ) : (
              proposals.map((proposal) => (
                <Card key={proposal.id} className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-subheading font-semibold text-white">
                            Event Proposal
                          </h3>
                          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            Pending Review
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 font-body">Creator:</span>
                            <span className="text-white font-mono">{proposal.creator?.walletAddress || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 font-body">Submitted:</span>
                            <span className="text-white font-subheading">{formatDate(proposal.submittedAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 font-body">Tax Wallet:</span>
                            <span className="text-white font-mono text-xs">{proposal.taxWalletAddress}</span>
                          </div>
                        </div>

                        {proposal.revenueBeneficiaries && proposal.revenueBeneficiaries.length > 0 && (
                          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                            <p className="text-gray-400 font-body text-xs mb-2">Revenue Split:</p>
                            <div className="space-y-1">
                              {proposal.revenueBeneficiaries.map((beneficiary, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-300 font-mono">{beneficiary.address.substring(0, 10)}...</span>
                                  <span className="text-white font-subheading font-semibold">{(beneficiary.percentage / 100).toFixed(2)}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleApproveProposal(proposal.id, proposal.taxWalletAddress)}
                          disabled={processingProposal === proposal.id}
                          className="bg-green-600 hover:bg-green-700 text-white font-subheading font-semibold"
                        >
                          {processingProposal === proposal.id ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        <Button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:')
                            if (reason) handleRejectProposal(proposal.id, reason)
                          }}
                          disabled={processingProposal === proposal.id}
                          variant="outline"
                          className="border-red-500/30 text-red-400 hover:bg-red-500/20 font-subheading font-semibold"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="eos" className="space-y-4">
            {eos.length === 0 ? (
              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-body">No event organizers registered</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
                <CardContent className="p-0">
                  <div className="divide-y divide-white/10">
                    {eos.map((eo) => (
                      <div key={eo.id} className="p-6 hover:bg-white/5 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-subheading font-semibold mb-1">
                              {eo.name || 'Unnamed EO'}
                            </p>
                            <p className="text-gray-400 font-mono text-sm mb-2">{eo.walletAddress}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>Joined: {formatDate(eo.createdAt)}</span>
                              <span>Events: {eo._count?.events || 0}</span>
                            </div>
                          </div>
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            Event Organizer
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card className="border-white/10 bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white font-subheading">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {!stats?.recentTransactions || stats.recentTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 font-body">No recent transactions</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.recentTransactions.map((tx) => (
                      <div key={tx.txHash} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                            {tx.type}
                          </Badge>
                          <span className="text-white font-heading text-sm">{formatEther(tx.amount)} ETH</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 font-mono truncate mr-2">{tx.txHash.substring(0, 20)}...</span>
                          <span className="text-gray-500">{formatDate(tx.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}