import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/api/dio_client.dart';
import '../../../core/auth/auth_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_drawer.dart';
import 'add_skill_dialog.dart';
import 'update_skill_dialog.dart';
import '../../training/screens/suggest_training_screen.dart';
import 'skill_growth_screen.dart';

class MySkillsScreen extends StatefulWidget {
  const MySkillsScreen({super.key});

  @override
  State<MySkillsScreen> createState() => _MySkillsScreenState();
}

class _MySkillsScreenState extends State<MySkillsScreen> {
  final DioClient _dioClient = DioClient();
  List<dynamic> _skills = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchSkills();
  }

  Future<void> _fetchSkills() async {
    try {
      final response = await _dioClient.dio.get('/employee-skills/my-skills');
      if (mounted) {
        setState(() {
          _skills = response.data;
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error fetching skills: $e');
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  Future<void> _addSkill() async {
    // Fetch all global skills first for the dropdown
    List<dynamic> globalSkills = [];
    try {
      final response = await _dioClient.dio.get('/skills');
      globalSkills = response.data;
    } catch (e) {
      print('Error fetching global skills: $e');
    }

    if (!mounted) return;

    showDialog(
      context: context,
      builder: (context) => AddSkillDialog(
        globalSkills: globalSkills,
        onSkillAdded: _fetchSkills,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      drawer: const AppDrawer(),
      appBar: AppBar(
        title: Text(
          'My Skills',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.w600,
            color: theme.textTheme.titleLarge?.color,
          ),
        ),
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        iconTheme: IconThemeData(color: theme.iconTheme.color),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const SuggestTrainingScreen()),
              );
            },
            icon: const Icon(LucideIcons.lightbulb, color: Colors.orange),
            tooltip: 'Suggest Training',
          ),
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const SkillGrowthScreen()),
              );
            },
            icon: const Icon(LucideIcons.barChart2, color: Colors.purple),
            tooltip: 'Skill Growth',
          ),
          IconButton(
            onPressed: _addSkill,
            icon: const Icon(LucideIcons.plus, color: AppColors.blue500),
            tooltip: 'Add Skill',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _skills.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(LucideIcons.layers, size: 48, color: theme.disabledColor),
                      const SizedBox(height: 16),
                      Text(
                        'No skills added yet',
                        style: GoogleFonts.inter(
                          color: theme.textTheme.bodyMedium?.color,
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _skills.length,
                  itemBuilder: (context, index) {
                    final skill = _skills[index];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: theme.cardColor,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: theme.dividerColor),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppColors.blue500.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(LucideIcons.code, color: AppColors.blue500, size: 20),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  skill['skillName'] ?? 'Unknown Skill',
                                  style: GoogleFonts.inter(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: theme.textTheme.titleMedium?.color,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    _buildBadge(context, 'Level ${skill['level'] ?? 1}'),
                                    const SizedBox(width: 8),
                                    _buildBadge(context, '${skill['yearsExperience'] ?? 0} Years'),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          Material(
                            color: Colors.transparent,
                            child: PopupMenuButton<String>(
                              icon: Icon(LucideIcons.moreVertical, size: 24, color: theme.iconTheme.color?.withOpacity(0.5)),
                              onSelected: (value) {
                                if (value == 'edit') {
                                  showDialog(
                                    context: context,
                                    builder: (context) => UpdateSkillDialog(
                                      skill: skill,
                                      onSkillUpdated: _fetchSkills,
                                    ),
                                  );
                                } else if (value == 'delete') {
                                  _confirmDelete(skill);
                                }
                              },
                              itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
                                const PopupMenuItem<String>(
                                  value: 'edit',
                                  child: Row(
                                    children: [
                                      Icon(LucideIcons.edit2, size: 16),
                                      SizedBox(width: 8),
                                      Text('Edit'),
                                    ],
                                  ),
                                ),
                                const PopupMenuItem<String>(
                                  value: 'delete',
                                  child: Row(
                                    children: [
                                      Icon(LucideIcons.trash2, size: 16, color: Colors.red),
                                      SizedBox(width: 8),
                                      Text('Delete', style: TextStyle(color: Colors.red)),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
    );
  }

  Future<void> _confirmDelete(Map<String, dynamic> skill) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Skill'),
        content: Text('Are you sure you want to delete ${skill['skillName']}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      _deleteSkill(skill['id']);
    }
  }

  Future<void> _deleteSkill(int id) async {
    try {
      await _dioClient.dio.delete('/employee-skills/$id');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Skill deleted successfully')),
        );
        _fetchSkills();
      }
    } catch (e) {
      print('Error deleting skill: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to delete skill: $e')),
        );
      }
    }
  }

  Widget _buildBadge(BuildContext context, String text) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: isDark ? AppColors.slate800 : AppColors.slate100,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text,
        style: GoogleFonts.inter(
          fontSize: 12,
          color: isDark ? AppColors.slate300 : AppColors.slate600,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
