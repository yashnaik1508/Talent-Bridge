import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/api/dio_client.dart';

class UpdateSkillDialog extends StatefulWidget {
  final Map<String, dynamic> skill;
  final VoidCallback onSkillUpdated;

  const UpdateSkillDialog({
    super.key,
    required this.skill,
    required this.onSkillUpdated,
  });

  @override
  State<UpdateSkillDialog> createState() => _UpdateSkillDialogState();
}

class _UpdateSkillDialogState extends State<UpdateSkillDialog> {
  final DioClient _dioClient = DioClient();
  final _formKey = GlobalKey<FormState>();
  
  late int _level;
  late int _yearsExperience;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _level = widget.skill['level'] ?? 1;
    _yearsExperience = widget.skill['yearsExperience'] ?? 0;
  }

  Future<void> _submit() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() => _isLoading = true);

      try {
        await _dioClient.dio.put('/employee-skills/${widget.skill['id']}', data: {
          'skillId': widget.skill['skillId'], // Required by backend even if not changing?
          'level': _level,
          'yearsExperience': _yearsExperience,
          'userId': widget.skill['userId'], // Keep original userId
        });

        if (mounted) {
          widget.onSkillUpdated();
          Navigator.pop(context);
        }
      } catch (e) {
        print('Error updating skill: $e');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed to update skill: $e')),
          );
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

    return AlertDialog(
      backgroundColor: theme.cardColor,
      title: Text(
        'Update ${widget.skill['skillName']}', 
        style: GoogleFonts.inter(
          fontWeight: FontWeight.bold,
          color: theme.textTheme.titleLarge?.color,
        )
      ),
      content: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Level Slider
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Proficiency Level: $_level', 
                    style: GoogleFonts.inter(
                      fontWeight: FontWeight.w500,
                      color: theme.textTheme.bodyMedium?.color,
                    )
                  ),
                  Slider(
                    value: _level.toDouble(),
                    min: 1,
                    max: 5,
                    divisions: 4,
                    label: _level.toString(),
                    onChanged: (val) => setState(() => _level = val.toInt()),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Experience
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Years of Experience',
                  labelStyle: TextStyle(color: theme.textTheme.bodyMedium?.color),
                  enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: theme.dividerColor)),
                ),
                style: TextStyle(color: theme.textTheme.bodyMedium?.color),
                keyboardType: TextInputType.number,
                initialValue: _yearsExperience.toString(),
                onSaved: (val) => _yearsExperience = int.tryParse(val ?? '0') ?? 0,
              ),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: _isLoading ? null : _submit,
          child: _isLoading 
            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
            : const Text('Update'),
        ),
      ],
    );
  }
}
