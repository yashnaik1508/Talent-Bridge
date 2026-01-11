import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/auth/auth_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../dashboard/screens/dashboard_screen.dart';
import '../../../core/providers/settings_provider.dart';
import '../../projects/screens/project_list_screen.dart';
import '../../employees/screens/employee_list_screen.dart';
import '../../skills/screens/skill_list_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _isLoading = false;

  Future<void> _handleLogin() async {
    if (_formKey.currentState!.validate()) {
      print('DEBUG: Form validated, starting login...');
      setState(() => _isLoading = true);
      final success = await context.read<AuthProvider>().login(
            _emailController.text,
            _passwordController.text,
          );
      print('DEBUG: Login result: $success');
      setState(() => _isLoading = false);

      if (success) {
        if (mounted) {
          final settings = context.read<SettingsProvider>();
          Widget targetScreen;
          
          switch (settings.defaultPage) {
            case 'Projects':
              targetScreen = const ProjectListScreen();
              break;
            case 'Employees':
              targetScreen = const EmployeeListScreen();
              break;
            case 'Skills':
              targetScreen = const SkillListScreen();
              break;
            case 'Dashboard':
            default:
              targetScreen = const DashboardScreen();
              break;
          }

          Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (context) => targetScreen),
          );
        }
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Login failed. Please check your credentials.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Logo or Icon
                  // Logo
                  Image.asset(
                    'assets/images/tb_logo_new.png',
                    height: 120,
                  ),
                  const SizedBox(height: 24),
                  
                  Text(
                    'Welcome Back',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.displaySmall?.copyWith(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: theme.textTheme.displayLarge?.color,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Sign in to continue to TalentBridge',
                    textAlign: TextAlign.center,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontSize: 16,
                      color: theme.colorScheme.secondary,
                    ),
                  ),
                  const SizedBox(height: 48),

                  // Email Field
                  TextFormField(
                    controller: _emailController,
                    style: theme.textTheme.bodyLarge,
                    decoration: InputDecoration(
                      labelText: 'Email',
                      prefixIcon: Icon(LucideIcons.mail, color: theme.iconTheme.color),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your email';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Password Field
                  TextFormField(
                    controller: _passwordController,
                    obscureText: true,
                    style: theme.textTheme.bodyLarge,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      prefixIcon: Icon(LucideIcons.lock, color: theme.iconTheme.color),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your password';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),

                  // Login Button
                  ElevatedButton(
                    onPressed: _isLoading ? null : _handleLogin,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.blue500,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : Text(
                            'Sign In',
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
