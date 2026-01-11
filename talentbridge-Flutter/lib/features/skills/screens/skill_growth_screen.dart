import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/api/dio_client.dart';
import '../../../core/theme/app_theme.dart';

class SkillGrowthScreen extends StatefulWidget {
  const SkillGrowthScreen({super.key});

  @override
  State<SkillGrowthScreen> createState() => _SkillGrowthScreenState();
}

class _SkillGrowthScreenState extends State<SkillGrowthScreen> {
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
      print('Error fetching skills for growth: $e');
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'Skill Growth',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.w600,
            color: theme.textTheme.titleLarge?.color,
          ),
        ),
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        iconTheme: IconThemeData(color: theme.iconTheme.color),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _skills.isEmpty
              ? Center(
                  child: Text(
                    'No skills data available to track growth.',
                    style: GoogleFonts.inter(color: theme.textTheme.bodyMedium?.color),
                  ),
                )
              : Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      Text(
                        'Skill Proficiency Radar',
                        style: GoogleFonts.inter(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: theme.textTheme.titleLarge?.color,
                        ),
                      ),
                      const SizedBox(height: 32),
                      Expanded(
                        child: RadarChart(
                          RadarChartData(
                            dataSets: [
                              RadarDataSet(
                                fillColor: AppColors.blue500.withOpacity(0.2),
                                borderColor: AppColors.blue500,
                                entryRadius: 3,
                                dataEntries: _skills.map((skill) {
                                  return RadarEntry(value: (skill['level'] ?? 1).toDouble());
                                }).toList(),
                                borderWidth: 2,
                              ),
                            ],
                            radarBackgroundColor: Colors.transparent,
                            borderData: FlBorderData(show: false),
                            radarBorderData: const BorderSide(color: Colors.transparent),
                            titlePositionPercentageOffset: 0.2,
                            titleTextStyle: GoogleFonts.inter(
                              color: theme.textTheme.bodySmall?.color,
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                            ),
                            getTitle: (index, angle) {
                              if (index < _skills.length) {
                                final name = _skills[index]['skillName'] ?? '';
                                return RadarChartTitle(
                                  text: name.length > 10 ? '${name.substring(0, 10)}...' : name,
                                  angle: angle,
                                );
                              }
                              return const RadarChartTitle(text: '');
                            },
                            tickCount: 4,
                            ticksTextStyle: const TextStyle(color: Colors.transparent),
                            tickBorderData: const BorderSide(color: Colors.transparent),
                            gridBorderData: BorderSide(color: theme.dividerColor, width: 1),
                          ),
                          swapAnimationDuration: const Duration(milliseconds: 400),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: theme.cardColor,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: theme.dividerColor),
                        ),
                        child: Column(
                          children: [
                            Text(
                              'Growth Summary',
                              style: GoogleFonts.inter(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: theme.textTheme.titleMedium?.color,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'You have ${_skills.length} skills tracked. Keep updating your proficiency levels to see your growth!',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.inter(
                                color: theme.textTheme.bodyMedium?.color,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }
}
