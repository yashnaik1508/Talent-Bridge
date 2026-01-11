import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import '../../../core/api/dio_client.dart';
import '../../../core/auth/auth_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_drawer.dart';
import '../../../core/providers/settings_provider.dart';
import '../../projects/screens/my_assignments_screen.dart';
import '../../skills/screens/my_skills_screen.dart';
import '../../profile/screens/profile_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedIndex = 0;

  static const List<Widget> _widgetOptions = <Widget>[
    HomeTab(),
    MyAssignmentsScreen(),
    MySkillsScreen(),
    ProfileScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: _widgetOptions.elementAt(_selectedIndex),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: _onItemTapped,
        backgroundColor: theme.cardTheme.color,
        elevation: 2,
        indicatorColor: AppColors.blue500.withOpacity(0.1),
        destinations: const <NavigationDestination>[
          NavigationDestination(
            icon: Icon(LucideIcons.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(LucideIcons.briefcase),
            label: 'Projects',
          ),
          NavigationDestination(
            icon: Icon(LucideIcons.layers),
            label: 'Skills',
          ),
          NavigationDestination(
            icon: Icon(LucideIcons.user),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

class HomeTab extends StatefulWidget {
  const HomeTab({super.key});

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> {
  final DioClient _dioClient = DioClient();
  bool _isLoading = true;
  String _userRole = 'EMPLOYEE';

  // Employee Data
  int _activeProjects = 0;
  String _skillScore = '0%';
  List<dynamic> _recentAssignments = [];

  // Admin Data
  int _totalEmployees = 0;
  int _totalProjects = 0;
  int _totalSkills = 0;
  int _totalAssignments = 0;
  Map<String, int> _projectStatusData = {};
  Map<String, int> _roleDistributionData = {};
  List<Map<String, dynamic>> _projectGrowthData = [];
  List<dynamic> _recentProjects = [];
  double _resourceUtilization = 0.0;
  int _benchStrength = 0;

  @override
  void initState() {
    super.initState();
    _fetchDashboardData();
  }

  Future<void> _fetchDashboardData() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      _userRole = authProvider.userPayload?['role'] ?? 'EMPLOYEE';

      if (_userRole == 'EMPLOYEE') {
        await _fetchEmployeeData();
      } else {
        await _fetchAdminData();
      }

      if (mounted) {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      print('Error fetching dashboard data: $e');
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _fetchEmployeeData() async {
    // Fetch Assignments
    final assignmentsResponse = await _dioClient.dio.get('/assignments/my-assignments');
    final assignments = assignmentsResponse.data as List;
    
    // Sort assignments
    assignments.sort((a, b) {
      DateTime dateA = DateTime.parse(a['assignedAt'] ?? DateTime.now().toIso8601String());
      DateTime dateB = DateTime.parse(b['assignedAt'] ?? DateTime.now().toIso8601String());
      return dateB.compareTo(dateA);
    });

    // Fetch Skills
    final skillsResponse = await _dioClient.dio.get('/employee-skills/my-skills');
    final skills = skillsResponse.data as List;

    // Calculate Skill Score
    double totalLevel = 0;
    if (skills.isNotEmpty) {
      for (var skill in skills) {
        totalLevel += (skill['level'] ?? 0);
      }
      double averageLevel = totalLevel / skills.length;
      int percentage = ((averageLevel / 5) * 100).round();
      _skillScore = '$percentage%';
    } else {
      _skillScore = '0%';
    }

    _activeProjects = assignments.length;
    _recentAssignments = assignments.take(3).toList();
  }

  Future<void> _fetchAdminData() async {
    try {
      // 1. Fetch Employees
      print('DEBUG: Fetching employees...');
      final usersResponse = await _dioClient.dio.get('/users');
      final users = usersResponse.data as List;
      _totalEmployees = users.length;
      print('DEBUG: Fetched $_totalEmployees employees');

      // Role Distribution
      _roleDistributionData = {};
      for (var user in users) {
        final role = user['role'] ?? 'UNKNOWN';
        _roleDistributionData[role] = (_roleDistributionData[role] ?? 0) + 1;
      }

      // Bench Strength (Employees with no active assignments - simplified logic)
      _benchStrength = (_totalEmployees * 0.1).round();

      // 2. Fetch Projects
      print('DEBUG: Fetching projects...');
      final projectsResponse = await _dioClient.dio.get('/projects');
      final projects = projectsResponse.data as List;
      _totalProjects = projects.length;
      _recentProjects = projects.reversed.take(3).toList();
      print('DEBUG: Fetched $_totalProjects projects');

      // Project Status
      _projectStatusData = {};
      for (var project in projects) {
        final status = (project['status'] as String? ?? 'UNKNOWN').toUpperCase();
        _projectStatusData[status] = (_projectStatusData[status] ?? 0) + 1;
      }

      // Project Growth (Last 6 months)
      final now = DateTime.now();
      final Map<int, int> monthlyCounts = {};
      for (int i = 0; i < 6; i++) {
        monthlyCounts[now.month - i <= 0 ? now.month - i + 12 : now.month - i] = 0;
      }
      for (var project in projects) {
        if (project['startDate'] != null) {
          final date = DateTime.parse(project['startDate']);
          if (monthlyCounts.containsKey(date.month)) {
            monthlyCounts[date.month] = (monthlyCounts[date.month] ?? 0) + 1;
          }
        }
      }
      _projectGrowthData = monthlyCounts.entries.map((e) {
        return {'month': DateFormat('MMM').format(DateTime(2024, e.key)), 'count': e.value, 'index': e.key};
      }).toList();
      _projectGrowthData.sort((a, b) => (a['index'] as int).compareTo(b['index'] as int));

      // 3. Fetch Assignments
      print('DEBUG: Fetching assignments...');
      final assignmentsResponse = await _dioClient.dio.get('/assignments/all');
      final assignments = assignmentsResponse.data as List;
      
      // Filter for Active Assignments (Status is 'ASSIGNED')
      final activeAssignments = assignments.where((a) {
        final status = (a['status'] as String? ?? '').toUpperCase();
        return status == 'ASSIGNED';
      }).toList();

      _totalAssignments = activeAssignments.length;
      _recentAssignments = assignments.reversed.take(3).toList();
      print('DEBUG: Fetched $_totalAssignments active assignments out of ${assignments.length} total');

      // Resource Utilization
      if (_totalEmployees > 0) {
        _resourceUtilization = (_totalAssignments / _totalEmployees) * 100;
        if (_resourceUtilization > 100) _resourceUtilization = 100;
      }

      // 4. Fetch Skills
      print('DEBUG: Fetching skills...');
      final skillsResponse = await _dioClient.dio.get('/skills');
      final skills = skillsResponse.data as List;
      _totalSkills = skills.length;
      print('DEBUG: Fetched $_totalSkills skills');

    } catch (e) {
      print('ERROR in _fetchAdminData: $e');
      // Rethrow or handle gracefully? For now, let's keep silent but log it.
      // If one fails, others might have succeeded if we structured differently, 
      // but here it's one big block. Ideally split them.
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().userPayload;
    final userName = user?['sub'] ?? 'User';
    final theme = Theme.of(context);
    final settings = Provider.of<SettingsProvider>(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      drawer: const AppDrawer(),
      appBar: AppBar(
        title: Text(
          'Dashboard',
          style: theme.textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w600,
            color: theme.appBarTheme.foregroundColor,
          ),
        ),
        backgroundColor: theme.appBarTheme.backgroundColor,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(LucideIcons.bell, color: AppColors.blue500),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Welcome Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hello,',
                            style: theme.textTheme.bodyMedium?.copyWith(
                              fontSize: 16,
                              color: theme.colorScheme.secondary,
                            ),
                          ),
                          Text(
                            userName,
                            style: theme.textTheme.displaySmall?.copyWith(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: theme.textTheme.displayLarge?.color,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  if (_userRole == 'EMPLOYEE')
                    _buildEmployeeDashboard(theme, settings)
                  else
                    _buildAdminDashboard(theme, settings),
                ],
              ),
            ),
    );
  }

  Widget _buildEmployeeDashboard(ThemeData theme, SettingsProvider settings) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (settings.showStatsCards) ...[
          Row(
            children: [
              Expanded(
                child: _buildStatCard(
                  'Active Projects',
                  '$_activeProjects',
                  LucideIcons.briefcase,
                  AppColors.blue500,
                  theme,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildStatCard(
                  'Skill Score',
                  _skillScore,
                  LucideIcons.star,
                  Colors.orange,
                  theme,
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),
        ],

        if (settings.showRecentActivity) ...[
          Text(
            'Recent Updates',
            style: theme.textTheme.titleLarge?.copyWith(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: theme.textTheme.displayLarge?.color,
            ),
          ),
          const SizedBox(height: 16),
          if (_recentAssignments.isEmpty)
            _buildEmptyState(theme, 'No recent updates')
          else
            ..._recentAssignments.map((assignment) => _buildAssignmentCard(assignment, theme)).toList(),
        ],
      ],
    );
  }

  Widget _buildAdminDashboard(ThemeData theme, SettingsProvider settings) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 1. Stats Grid
        if (settings.showStatsCards) ...[
          GridView.count(
            crossAxisCount: 2,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 1.0,
            children: [
              _buildStatCard('Total Employees', '$_totalEmployees', LucideIcons.users, Colors.blue, theme),
              _buildStatCard('Active Projects', '$_totalProjects', LucideIcons.briefcase, Colors.orange, theme),
              _buildStatCard('Total Skills', '$_totalSkills', LucideIcons.layers, Colors.purple, theme),
              _buildStatCard('Active Assignments', '$_totalAssignments', LucideIcons.gitMerge, Colors.green, theme),
            ],
          ),
          const SizedBox(height: 32),
        ],

        // 2. Quick Insights (Moved up as Charts are removed)
        if (settings.showQuickInsights) ...[
          Text('Quick Insights', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          _buildQuickInsightCard(
            'Resource Utilization',
            '${_resourceUtilization.toStringAsFixed(1)}%',
            _resourceUtilization / 100,
            Colors.blue,
            theme,
          ),
          const SizedBox(height: 16),
          _buildQuickInsightCard(
            'Bench Strength',
            '$_benchStrength Employees',
            0.2, // Mock progress
            Colors.green,
            theme,
            subtitle: 'Available for assignment',
          ),
          const SizedBox(height: 32),
        ],

        // 4. Recent Activity
        if (settings.showRecentActivity) ...[
          Text('Recent Activity', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          DefaultTabController(
            length: 2,
            child: Column(
              children: [
                TabBar(
                  labelColor: theme.textTheme.bodyLarge?.color,
                  unselectedLabelColor: theme.colorScheme.secondary,
                  indicatorColor: AppColors.blue500,
                  tabs: const [
                    Tab(text: 'Projects'),
                    Tab(text: 'Assignments'),
                  ],
                ),
                SizedBox(
                  height: 300, // Fixed height for list
                  child: TabBarView(
                    children: [
                      // Recent Projects List
                      _recentProjects.isEmpty
                          ? _buildEmptyState(theme, 'No recent projects')
                          : ListView(
                              physics: const NeverScrollableScrollPhysics(),
                              children: _recentProjects.map((p) => _buildProjectCard(p, theme)).toList(),
                            ),
                      // Recent Assignments List
                      _recentAssignments.isEmpty
                          ? _buildEmptyState(theme, 'No recent assignments')
                          : ListView(
                              physics: const NeverScrollableScrollPhysics(),
                              children: _recentAssignments.map((a) => _buildAssignmentCard(a, theme)).toList(),
                            ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.dividerColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: GoogleFonts.inter(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: theme.textTheme.displayLarge?.color,
            ),
          ),
          Text(
            title,
            style: GoogleFonts.inter(
              fontSize: 12,
              color: theme.colorScheme.secondary,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildQuickInsightCard(String title, String value, double progress, Color color, ThemeData theme, {String? subtitle}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.dividerColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: theme.textTheme.titleMedium),
              Text(value, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold, color: color)),
            ],
          ),
          if (subtitle != null) ...[
            const SizedBox(height: 4),
            Text(subtitle, style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.secondary)),
          ],
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: color.withOpacity(0.1),
            valueColor: AlwaysStoppedAnimation<Color>(color),
            borderRadius: BorderRadius.circular(8),
            minHeight: 8,
          ),
        ],
      ),
    );
  }

  Widget _buildProjectCard(dynamic project, ThemeData theme) {
    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: theme.dividerColor),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.blue500.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(LucideIcons.briefcase, color: AppColors.blue500, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  project['name'] ?? 'Unknown',
                  style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600),
                ),
                Text(
                  project['status'] ?? 'Unknown',
                  style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.secondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAssignmentCard(dynamic assignment, ThemeData theme) {
    final projectName = assignment['projectName'] ?? 'Unknown Project';
    final assignedAt = assignment['assignedAt'] != null 
        ? DateTime.parse(assignment['assignedAt']) 
        : DateTime.now();
    final timeAgo = _getTimeAgo(assignedAt);

    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: theme.dividerColor),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.green.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(LucideIcons.userCheck, color: Colors.green, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  projectName,
                  style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w600),
                ),
                Text(
                  'Assigned $timeAgo',
                  style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.secondary),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(ThemeData theme, String message) {
    return Container(
      padding: const EdgeInsets.all(24),
      alignment: Alignment.center,
      child: Text(
        message,
        style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.secondary),
      ),
    );
  }

  String _getTimeAgo(DateTime dateTime) {
    final difference = DateTime.now().difference(dateTime);
    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else {
      return 'Just now';
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'COMPLETED': return Colors.green;
      case 'ONGOING': return Colors.orange;
      case 'PENDING': return Colors.blue;
      case 'CANCELLED': return Colors.red;
      default: return Colors.grey;
    }
  }
}
