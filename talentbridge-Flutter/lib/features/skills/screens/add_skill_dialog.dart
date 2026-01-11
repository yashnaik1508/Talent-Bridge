import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/api/dio_client.dart';

class AddSkillDialog extends StatefulWidget {
  final List<dynamic> globalSkills;
  final VoidCallback onSkillAdded;

  const AddSkillDialog({
    super.key,
    required this.globalSkills,
    required this.onSkillAdded,
  });

  @override
  State<AddSkillDialog> createState() => _AddSkillDialogState();
}

class _AddSkillDialogState extends State<AddSkillDialog> {
  final DioClient _dioClient = DioClient();
  final _formKey = GlobalKey<FormState>();
  
  String? _selectedSkillId;
  String? _customSkillName;
  int _level = 1;
  int _yearsExperience = 0;
  bool _isCustomSkill = false;
  bool _isLoading = false;

  Future<void> _submit() async {
    if (_formKey.currentState!.validate()) {
      _formKey.currentState!.save();
      setState(() => _isLoading = true);

      try {
        final data = {
          'skillId': _isCustomSkill ? null : int.parse(_selectedSkillId!),
          'skillName': _isCustomSkill ? '$_customSkillName (Custom)' : null, // Backend logic for custom skill
          'level': _level,
          'yearsExperience': _yearsExperience,
          'category': _isCustomSkill ? 'Other (Custom)' : null, // Default category for custom
        };

        // If custom, we might need to handle it differently depending on backend
        // Based on analysis: Backend AddEmployeeSkill logic handles creating new skill if ID is null but name is provided?
        // Actually, the frontend logic was: Create Skill -> Get ID -> Add Employee Skill.
        // Let's try to send the payload and see if backend handles it or if we need a two-step process.
        // Looking at EmployeeSkillController.java:
        // It takes EmployeeSkill object. If it has skillId, it links.
        // If we want to add a NEW skill, we might need to call /api/skills first?
        // Let's assume for now we use the same flow as web:
        // 1. If custom, create skill first (POST /api/skills)
        // 2. Then add employee skill (POST /api/employee-skills)
        
        int? finalSkillId;

        if (_isCustomSkill) {
          // Create custom skill
          final skillResponse = await _dioClient.dio.post('/skills', data: {
            'name': _customSkillName,
            'category': 'Other (Custom)',
          });
          finalSkillId = skillResponse.data['skillId'];
        } else {
          finalSkillId = int.parse(_selectedSkillId!);
        }

        // Add to employee
        await _dioClient.dio.post('/employee-skills', data: {
          'skillId': finalSkillId,
          'level': _level,
          'yearsExperience': _yearsExperience,
        });

        if (mounted) {
          widget.onSkillAdded();
          Navigator.pop(context);
        }
      } catch (e) {
        print('Error adding skill: $e');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed to add skill: $e')),
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
        'Add Skill', 
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
              // Toggle Custom Skill
              Row(
                children: [
                  Checkbox(
                    value: _isCustomSkill,
                    onChanged: (val) => setState(() {
                      _isCustomSkill = val!;
                      _selectedSkillId = null;
                      _customSkillName = null;
                    }),
                  ),
                  Text(
                    'Custom Skill', 
                    style: GoogleFonts.inter(color: theme.textTheme.bodyMedium?.color)
                  ),
                ],
              ),
              
              if (!_isCustomSkill)
                DropdownButtonFormField<String>(
                  decoration: InputDecoration(
                    labelText: 'Select Skill',
                    labelStyle: TextStyle(color: theme.textTheme.bodyMedium?.color),
                    enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: theme.dividerColor)),
                  ),
                  dropdownColor: theme.cardColor,
                  items: widget.globalSkills.map<DropdownMenuItem<String>>((skill) {
                    return DropdownMenuItem<String>(
                      value: skill['skillId'].toString(),
                      child: Text(
                        skill['name'],
                        style: TextStyle(color: theme.textTheme.bodyMedium?.color),
                      ),
                    );
                  }).toList(),
                  onChanged: (val) => setState(() => _selectedSkillId = val),
                  validator: (val) => val == null ? 'Please select a skill' : null,
                )
              else
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Skill Name',
                    labelStyle: TextStyle(color: theme.textTheme.bodyMedium?.color),
                    enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: theme.dividerColor)),
                  ),
                  style: TextStyle(color: theme.textTheme.bodyMedium?.color),
                  onSaved: (val) => _customSkillName = val,
                  validator: (val) => val == null || val.isEmpty ? 'Enter skill name' : null,
                ),

              const SizedBox(height: 16),

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

              // Experience
              TextFormField(
                decoration: InputDecoration(
                  labelText: 'Years of Experience',
                  labelStyle: TextStyle(color: theme.textTheme.bodyMedium?.color),
                  enabledBorder: UnderlineInputBorder(borderSide: BorderSide(color: theme.dividerColor)),
                ),
                style: TextStyle(color: theme.textTheme.bodyMedium?.color),
                keyboardType: TextInputType.number,
                initialValue: '0',
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
            : const Text('Add'),
        ),
      ],
    );
  }
}
