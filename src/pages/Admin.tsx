import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Users, CheckCircle, Heart, Shield, Search, Loader2 } from 'lucide-react';

interface Profile {
  user_id: string;
  full_name: string;
  age: number;
  profession: string;
  verified: boolean;
  created_at: string;
}

interface Stats {
  totalUsers: number;
  verifiedUsers: number;
  activeMatches: number;
}

const Admin = () => {
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, verifiedUsers: 0, activeMatches: 0 });
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    // Fetch stats
    const { data: allProfiles } = await supabase.from('profiles').select('verified, invisible');
    const { data: matches } = await supabase.from('matches').select('id');

    setStats({
      totalUsers: allProfiles?.length || 0,
      verifiedUsers: allProfiles?.filter(p => p.verified).length || 0,
      activeMatches: matches?.length || 0,
    });

    // Fetch all profiles
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('user_id, full_name, age, profession, verified, created_at')
      .order('created_at', { ascending: false });

    setProfiles(profilesData || []);
    setLoading(false);
  };

  const handleVerifyUser = async (userId: string, verified: boolean) => {
    setActionLoading(userId);
    const { error } = await supabase
      .from('profiles')
      .update({ 
        verified,
        verified_at: verified ? new Date().toISOString() : null
      })
      .eq('user_id', userId);

    setActionLoading(null);

    if (error) {
      toast.error('Could not update verification status');
    } else {
      toast.success(verified ? 'User verified' : 'Verification removed');
      loadData();
    }
  };

  const filteredProfiles = profiles.filter(profile =>
    profile.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.profession.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-copper" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-copper" />
          <h1 className="font-serif text-4xl text-text-dark">
            Admin Dashboard
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-copper/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-warm-gray" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-dark">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-sage/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-dark">{stats.verifiedUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-copper/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Matches</CardTitle>
              <Heart className="h-4 w-4 text-copper" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-text-dark">{stats.activeMatches}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="matches">Match Stats</TabsTrigger>
            <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className="border-copper/20">
              <CardHeader>
                <CardTitle>User Search & Management</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
                  <Input
                    placeholder="Search by name or profession..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProfiles.map((profile) => (
                    <div
                      key={profile.user_id}
                      className="flex items-center justify-between p-4 border border-copper/10 rounded-lg hover:bg-copper/5 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-text-dark">
                            {profile.full_name}, {profile.age}
                          </h3>
                          {profile.verified && (
                            <Badge variant="secondary" className="bg-sage/10 text-sage">
                              Verified ✓
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-warm-gray mt-1">
                          {profile.profession}
                        </p>
                        <p className="text-xs text-warm-gray mt-1">
                          Joined {new Date(profile.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={profile.verified ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => handleVerifyUser(profile.user_id, !profile.verified)}
                          disabled={actionLoading === profile.user_id}
                        >
                          {actionLoading === profile.user_id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : profile.verified ? 'Unverify' : 'Verify'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches">
            <Card className="border-copper/20">
              <CardHeader>
                <CardTitle>Matching Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-warm-gray">
                  Matching statistics and insights will appear here as the platform grows.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation">
            <Card className="border-copper/20">
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-warm-gray">
                  Flagged content and moderation tools will appear here. Currently, all content 
                  goes through manual review during the beta phase.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
