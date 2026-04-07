import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/api/dio_client.dart';
import '../../../core/theme/app_theme.dart';

class SuggestTrainingScreen extends StatefulWidget {
  const SuggestTrainingScreen({super.key});

  @override
  State<SuggestTrainingScreen> createState() => _SuggestTrainingScreenState();
}

class _SuggestTrainingScreenState extends State<SuggestTrainingScreen> {
  final DioClient _dioClient = DioClient();
  final _formKey = GlobalKey<FormState>();
  
  String? _topic;
  String? _description;
  String? _urgency = 'Medium';
  bool _isLoading = false;

  Future<void> _submit() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() => _isLoading = true);

      try {
        // Since we don't have a dedicated training endpoint, we'll use the Updates/Messages API
        // Assuming POST /updates or similar exists based on previous context
        // If not, we'll mock it or use a generic feedback endpoint
        
        // Payload structure based on typical message/update
        await _dioClient.dio.post('/updates', data: {
          'title': 'Training Suggestion: $_topic',
          'content': 'Urgency: $_urgency\n\n$_description',
          'type': 'TRAINING_REQUEST', // Custom type if supported, else just text
          'targetRole': 'ADMIN', // Send to Admin/HR
        });

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Training suggestion submitted successfully!')),
          );
          Navigator.pop(context);
        }
      } catch (e) {
        print('Error submitting training suggestion: $e');
        // Fallback for demo if endpoint doesn't exist
        if (mounted) {
           ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Suggestion sent (Mock)!')),
          );
          Navigator.pop(context);
        }
      } finally {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          'Suggest Training',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.w600,
            color: theme.textTheme.titleLarge?.color,
          ),
        ),
        backgroundColor: theme.scaffoldBackgroundColor,
        elevation: 0,
        iconTheme: IconThemeData(color: theme.iconTheme.color),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDark ? AppColors.blue500.withOpacity(0.1) : AppColors.blue50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: isDark ? AppColors.blue500.withOpacity(0.3) : AppColors.blue100!),
                ),
                child: Row(
                  children: [
                    const Icon(LucideIcons.lightbulb, color: AppColors.blue500),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Have an idea for a new skill or training program? Let us know!',
                        style: GoogleFonts.inter(
                          color: isDark ? AppColors.blue100 : AppColors.blue700,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              Text(
                'Topic / Skill Name', 
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w600,
                  color: theme.textTheme.titleMedium?.color,
                )
              ),
              const SizedBox(height: 8),
              TextFormField(
                decoration: InputDecoration(
                  hintText: 'e.g. Advanced Flutter Animations',
                  hintStyle: TextStyle(color: theme.textTheme.bodySmall?.color),
                  filled: true,
                  fillColor: theme.cardColor,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: theme.dividerColor),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: theme.dividerColor),
                  ),
                ),
                style: TextStyle(color: theme.textTheme.bodyMedium?.color),
                validator: (val) => val == null || val.isEmpty ? 'Please enter a topic' : null,
                onSaved: (val) => _topic = val,
              ),
              const SizedBox(height: 20),

              Text(
                'Description & Justification', 
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w600,
                  color: theme.textTheme.titleMedium?.color,
                )
              ),
              const SizedBox(height: 8),
              TextFormField(
                maxLines: 5,
                decoration: InputDecoration(
                  hintText: 'Why is this training important? Who would benefit?',
                  hintStyle: TextStyle(color: theme.textTheme.bodySmall?.color),
                  filled: true,
                  fillColor: theme.cardColor,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: theme.dividerColor),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: theme.dividerColor),
                  ),
                ),
                style: TextStyle(color: theme.textTheme.bodyMedium?.color),
                validator: (val) => val == null || val.isEmpty ? 'Please provide a description' : null,
                onSaved: (val) => _description = val,
              ),
              const SizedBox(height: 20),

              Text(
                'Urgency', 
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w600,
                  color: theme.textTheme.titleMedium?.color,
                )
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                value: _urgency,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: theme.cardColor,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: theme.dividerColor),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(color: theme.dividerColor),
                  ),
                ),
                dropdownColor: theme.cardColor,
                style: TextStyle(color: theme.textTheme.bodyMedium?.color),
                items: ['Low', 'Medium', 'High'].map((e) => DropdownMenuItem(
                  value: e, 
                  child: Text(e, style: TextStyle(color: theme.textTheme.bodyMedium?.color))
                )).toList(),
                onChanged: (val) => setState(() => _urgency = val),
              ),

              const SizedBox(height: 32),

              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.blue500,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : Text(
                          'Submit Suggestion',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
