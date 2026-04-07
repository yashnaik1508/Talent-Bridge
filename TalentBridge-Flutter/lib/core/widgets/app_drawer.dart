import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../auth/auth_provider.dart';
import '../../features/dashboard/screens/dashboard_screen.dart';
import '../../features/projects/screens/my_assignments_screen.dart';
import '../../features/skills/screens/my_skills_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../theme/app_theme.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/employees/screens/employee_list_screen.dart';
import '../../features/skills/screens/skill_list_screen.dart';
import '../../features/projects/screens/project_list_screen.dart';
import '../../features/matching/screens/matching_screen.dart';
import '../../features/analytics/screens/analytics_screen.dart';
import '../../features/settings/screens/settings_screen.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final userRole = authProvider.userPayload?['role'] ?? 'EMPLOYEE';
    final theme = Theme.of(context);

    // Define menus based on role (matching React Sidebar.jsx)
    final Map<String, List<Map<String, dynamic>>> menus = {
      'ADMIN': [
        {'name': 'Dashboard', 'icon': LucideIcons.layoutDashboard, 'route': const DashboardScreen()},
        {'name': 'Employees', 'icon': LucideIcons.users, 'route': const EmployeeListScreen()},
        {'name': 'Skills', 'icon': LucideIcons.layers, 'route': const SkillListScreen()},
        {'name': 'Projects', 'icon': LucideIcons.briefcase, 'route': const ProjectListScreen()},
        {'name': 'Matching', 'icon': LucideIcons.gitMerge, 'route': const MatchingScreen()},
        {'name': 'Analytics', 'icon': LucideIcons.barChart2, 'route': AnalyticsScreen()},
        {'name': 'Settings', 'icon': LucideIcons.settings, 'route': const SettingsScreen()},
      ],
      'HR': [
        {'name': 'Dashboard', 'icon': LucideIcons.layoutDashboard, 'route': const DashboardScreen()},
        {'name': 'Employees', 'icon': LucideIcons.users, 'route': const EmployeeListScreen()},
        {'name': 'Skills', 'icon': LucideIcons.layers, 'route': const SkillListScreen()},
        {'name': 'Analytics', 'icon': LucideIcons.barChart2, 'route': AnalyticsScreen()},
      ],
      'PM': [
        {'name': 'Dashboard', 'icon': LucideIcons.layoutDashboard, 'route': const DashboardScreen()},
        {'name': 'Projects', 'icon': LucideIcons.briefcase, 'route': const ProjectListScreen()},
        {'name': 'Matching', 'icon': LucideIcons.gitMerge, 'route': const MatchingScreen()},
        {'name': 'Analytics', 'icon': LucideIcons.barChart2, 'route': AnalyticsScreen()},
      ],
      'EMPLOYEE': [
        {'name': 'Dashboard', 'icon': LucideIcons.layoutDashboard, 'route': const DashboardScreen()},
        {'name': 'My Skills', 'icon': LucideIcons.award, 'route': const MySkillsScreen()},
        {'name': 'My Assignments', 'icon': LucideIcons.userCheck, 'route': const MyAssignmentsScreen()},
      ],
    };

    final menuItems = menus[userRole] ?? menus['EMPLOYEE']!;

    return Drawer(
      backgroundColor: theme.scaffoldBackgroundColor,
      child: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
            decoration: BoxDecoration(
              color: theme.cardTheme.color,
              border: Border(bottom: BorderSide(color: theme.dividerColor)),
            ),
            child: Row(
              children: [
                Image.asset('assets/images/logo.png', width: 32, height: 32),
                const SizedBox(width: 12),
                Text(
                  'TalentBridge',
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.5,
                  ),
                ),
              ],
            ),
          ),

          // Menu Items
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: menuItems.length,
              itemBuilder: (context, index) {
                final item = menuItems[index];
                return ListTile(
                  leading: Icon(item['icon'] as IconData, color: AppColors.slate400),
                  title: Text(
                    item['name'] as String,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                      color: theme.textTheme.bodyLarge?.color,
                    ),
                  ),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  onTap: () {
                    Navigator.pop(context); // Close drawer
                    if (item['route'] != null) {
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(builder: (context) => item['route'] as Widget),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('${item['name']} is coming soon!'),
                          backgroundColor: AppColors.blue500,
                        ),
                      );
                    }
                  },
                );
              },
            ),
          ),

          // Footer (Profile & Logout)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: theme.dividerColor)),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(LucideIcons.user, color: AppColors.slate400),
                  title: Text('Profile', style: theme.textTheme.bodyMedium),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const ProfileScreen()),
                    );
                  },
                ),
                ListTile(
                  leading: const Icon(LucideIcons.logOut, color: Colors.red),
                  title: Text('Sign Out', style: theme.textTheme.bodyMedium?.copyWith(color: Colors.red)),
                  onTap: () async {
                    await authProvider.logout();
                    if (context.mounted) {
                      Navigator.of(context).pushAndRemoveUntil(
                        MaterialPageRoute(builder: (context) => const LoginScreen()),
                        (route) => false,
                      );
                    }
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
