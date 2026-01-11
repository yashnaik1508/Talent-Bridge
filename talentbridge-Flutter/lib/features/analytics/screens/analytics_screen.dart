import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../../../core/api/dio_client.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_drawer.dart';

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  final DioClient _dioClient = DioClient();
  bool _isLoading = true;
  
  // Data for charts
  Map<String, int> _projectStatusData = {};
  List<Map<String, dynamic>> _projectTrendData = [];
  List<Map<String, dynamic>> _resourceUtilizationData = [];

  @override
  void initState() {
    super.initState();
    _fetchAnalyticsData();
  }

  Future<void> _fetchAnalyticsData() async {
    try {
      // Fetch Projects
      final projectsResponse = await _dioClient.dio.get('/projects', queryParameters: {'size': 100});
      final List<dynamic> projects = projectsResponse.data;

      // Fetch Assignments
      final assignmentsResponse = await _dioClient.dio.get('/assignments/all');
      final List<dynamic> assignments = assignmentsResponse.data;

      _processProjectStatus(projects);
      _processProjectTrend(projects);
      _processResourceUtilization(assignments);

      if (mounted) {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      print('Error fetching analytics: $e');
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _processProjectStatus(List<dynamic> projects) {
    final statusCounts = <String, int>{};
    for (var project in projects) {
      final status = (project['status'] as String? ?? 'UNKNOWN').toUpperCase();
      statusCounts[status] = (statusCounts[status] ?? 0) + 1;
    }
    _projectStatusData = statusCounts;
  }

  void _processProjectTrend(List<dynamic> projects) {
    // Group by Start Date Month (last 6 months)
    final now = DateTime.now();
    final Map<int, int> monthlyCounts = {};

    for (int i = 0; i < 6; i++) {
      monthlyCounts[now.month - i <= 0 ? now.month - i + 12 : now.month - i] = 0;
    }

    for (var project in projects) {
      final startDateStr = project['startDate'];
      if (startDateStr != null) {
        final startDate = DateTime.parse(startDateStr);
        // Simple check if within last year roughly, for demo
        if (startDate.year == now.year || (startDate.year == now.year - 1 && startDate.month > now.month)) {
           monthlyCounts[startDate.month] = (monthlyCounts[startDate.month] ?? 0) + 1;
        }
      }
    }
    
    // Convert to list for chart, sorted by month
    // This is a simplified logic for the "Trend" chart
    _projectTrendData = monthlyCounts.entries.map((e) {
      return {'month': DateFormat('MMM').format(DateTime(2024, e.key)), 'count': e.value, 'monthIndex': e.key};
    }).toList();
    
    // Sort roughly (this is tricky with year wrap around, but for simple demo ok)
    // Better: sort by date
  }

  void _processResourceUtilization(List<dynamic> assignments) {
    // Count active assignments per month (based on assignedAt)
    final Map<int, int> monthlyCounts = {};
    
    for (var assignment in assignments) {
      final assignedAtStr = assignment['assignedAt'];
      if (assignedAtStr != null) {
        final assignedAt = DateTime.parse(assignedAtStr);
        monthlyCounts[assignedAt.month] = (monthlyCounts[assignedAt.month] ?? 0) + 1;
      }
    }

    _resourceUtilizationData = monthlyCounts.entries.map((e) {
      return {'month': DateFormat('MMM').format(DateTime(2024, e.key)), 'count': e.value, 'monthIndex': e.key};
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      drawer: const AppDrawer(),
      appBar: AppBar(
        title: Text(
          'Analytics',
          style: theme.textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w600,
            color: theme.appBarTheme.foregroundColor,
          ),
        ),
        backgroundColor: theme.appBarTheme.backgroundColor,
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _buildProjectStatusChart(theme),
                  const SizedBox(height: 24),
                  _buildResourceUtilizationChart(theme),
                  const SizedBox(height: 24),
                  _buildProjectTrendChart(theme),
                ],
              ),
            ),
    );
  }

  Widget _buildProjectStatusChart(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.dividerColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Project Status Distribution',
            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 200,
            child: PieChart(
              PieChartData(
                sectionsSpace: 2,
                centerSpaceRadius: 40,
                sections: _projectStatusData.entries.map((e) {
                  final color = _getStatusColor(e.key);
                  return PieChartSectionData(
                    color: color,
                    value: e.value.toDouble(),
                    title: '${e.value}',
                    radius: 50,
                    titleStyle: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 24),
          Wrap(
            spacing: 16,
            runSpacing: 8,
            children: _projectStatusData.keys.map((status) {
              return Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: _getStatusColor(status),
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    status,
                    style: theme.textTheme.bodySmall,
                  ),
                ],
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildResourceUtilizationChart(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.dividerColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Resource Utilization',
            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 200,
            child: BarChart(
              BarChartData(
                alignment: BarChartAlignment.spaceAround,
                maxY: 20, // Adjust dynamic max
                barTouchData: BarTouchData(enabled: false),
                titlesData: FlTitlesData(
                  show: true,
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (value, meta) {
                        if (value.toInt() >= 0 && value.toInt() < _resourceUtilizationData.length) {
                          return Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Text(
                              _resourceUtilizationData[value.toInt()]['month'],
                              style: theme.textTheme.bodySmall?.copyWith(fontSize: 10),
                            ),
                          );
                        }
                        return const Text('');
                      },
                    ),
                  ),
                  leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 30)),
                  topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                ),
                gridData: const FlGridData(show: true, drawVerticalLine: false),
                borderData: FlBorderData(show: false),
                barGroups: _resourceUtilizationData.asMap().entries.map((e) {
                  return BarChartGroupData(
                    x: e.key,
                    barRods: [
                      BarChartRodData(
                        toY: (e.value['count'] as int).toDouble(),
                        color: AppColors.blue500,
                        width: 16,
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
                      ),
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProjectTrendChart(ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.cardTheme.color,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.dividerColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Project Trend (Month-wise)',
            style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 200,
            child: LineChart(
              LineChartData(
                gridData: const FlGridData(show: true, drawVerticalLine: false),
                titlesData: FlTitlesData(
                  show: true,
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (value, meta) {
                        if (value.toInt() >= 0 && value.toInt() < _projectTrendData.length) {
                          return Padding(
                            padding: const EdgeInsets.only(top: 8.0),
                            child: Text(
                              _projectTrendData[value.toInt()]['month'],
                              style: theme.textTheme.bodySmall?.copyWith(fontSize: 10),
                            ),
                          );
                        }
                        return const Text('');
                      },
                    ),
                  ),
                  leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: true, reservedSize: 30)),
                  topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                ),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: _projectTrendData.asMap().entries.map((e) {
                      return FlSpot(e.key.toDouble(), (e.value['count'] as int).toDouble());
                    }).toList(),
                    isCurved: true,
                    color: Colors.cyan,
                    barWidth: 3,
                    isStrokeCapRound: true,
                    dotData: const FlDotData(show: true),
                    belowBarData: BarAreaData(
                      show: true,
                      color: Colors.cyan.withOpacity(0.1),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'COMPLETED':
        return Colors.green;
      case 'ONGOING':
        return Colors.orange;
      case 'PENDING':
      case 'OPEN':
        return Colors.blue;
      case 'CANCELLED':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
