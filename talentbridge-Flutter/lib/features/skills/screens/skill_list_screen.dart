import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/api/dio_client.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_drawer.dart';
import '../widgets/add_skill_dialog.dart';

class SkillListScreen extends StatefulWidget {
  const SkillListScreen({super.key});

  @override
  State<SkillListScreen> createState() => _SkillListScreenState();
}

class _SkillListScreenState extends State<SkillListScreen> {
  final DioClient _dioClient = DioClient();
  List<dynamic> _skills = [];
  List<dynamic> _filteredSkills = [];
  bool _isLoading = true;
  bool _isSearching = false;
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchSkills();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      _filteredSkills = _skills.where((skill) {
        final name = (skill['name'] ?? '').toString().toLowerCase();
        final category = (skill['category'] ?? '').toString().toLowerCase();
        return name.contains(query) || category.contains(query);
      }).toList();
    });
  }

  Future<void> _fetchSkills() async {
    try {
      final response = await _dioClient.dio.get('/skills');
      if (mounted) {
        setState(() {
          _skills = response.data;
          _filteredSkills = _skills;
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error fetching skills: $e');
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to fetch skills')),
        );
      }
    }
  }

  void _showAddSkillDialog() {
    showDialog(
      context: context,
      builder: (context) => AddSkillDialog(
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
        title: _isSearching
            ? TextField(
                controller: _searchController,
                autofocus: true,
                style: theme.textTheme.bodyLarge,
                decoration: InputDecoration(
                  hintText: 'Search skills...',
                  hintStyle: theme.textTheme.bodyMedium?.copyWith(color: theme.hintColor),
                  border: InputBorder.none,
                ),
              )
            : Text(
                'Skills',
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w600,
                  color: theme.appBarTheme.foregroundColor,
                ),
              ),
        backgroundColor: theme.appBarTheme.backgroundColor,
        elevation: 0,
        actions: [
          IconButton(
            onPressed: () {
              setState(() {
                if (_isSearching) {
                  _isSearching = false;
                  _searchController.clear();
                  _filteredSkills = _skills;
                } else {
                  _isSearching = true;
                }
              });
            },
            icon: Icon(
              _isSearching ? LucideIcons.x : LucideIcons.search,
              color: AppColors.blue500,
            ),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _filteredSkills.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(LucideIcons.layers, size: 48, color: theme.disabledColor),
                      const SizedBox(height: 16),
                      Text(
                        _isSearching ? 'No matching skills found' : 'No skills found',
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
                  itemCount: _filteredSkills.length,
                  itemBuilder: (context, index) {
                    final skill = _filteredSkills[index];
                    return _buildSkillCard(skill, theme);
                  },
                ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddSkillDialog,
        backgroundColor: AppColors.blue500,
        icon: const Icon(LucideIcons.plus, color: Colors.white),
        label: Text(
          'Add Skill',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _buildSkillCard(dynamic skill, ThemeData theme) {
    final skillName = skill['name'] ?? 'Unknown Skill';
    final category = skill['category'] ?? 'Uncategorized';
    
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
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
            child: const Icon(LucideIcons.code, color: AppColors.blue500, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  skillName,
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: theme.textTheme.titleMedium?.color,
                  ),
                ),
                const SizedBox(height: 4),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: theme.dividerColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(4),
                    border: Border.all(color: theme.dividerColor),
                  ),
                  child: Text(
                    category,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: theme.colorScheme.secondary,
                    ),
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () {
              // TODO: Edit/Delete skill
            },
            icon: Icon(LucideIcons.moreVertical, color: theme.iconTheme.color),
          ),
        ],
      ),
    );
  }
}
