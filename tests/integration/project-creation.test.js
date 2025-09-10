const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Integration Test: Project Creation Validation
 *
 * This test validates the project creation process as documented in
 * quickstart.md step 1. It ensures that:
 * 1. Next.js project is created with correct configuration
 * 2. Required files and directories are present
 * 3. Dependencies are installed correctly
 * 4. TypeScript compilation works
 * 5. Build process succeeds
 * 6. Development server can start
 * 7. ESLint runs without errors
 *
 * Following TDD approach - this test should FAIL initially until
 * the project setup is properly implemented.
 */

describe('Project Creation Validation (Quickstart Step 1)', () => {
  let testProjectDir;
  let originalCwd;

  beforeAll(() => {
    originalCwd = process.cwd();
    // Create a temporary directory for testing
    testProjectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cpaonweb-test-'));
    console.log(`Test project directory: ${testProjectDir}`);
  });

  afterAll(() => {
    process.chdir(originalCwd);
    // Clean up test directory
    if (fs.existsSync(testProjectDir)) {
      fs.rmSync(testProjectDir, { recursive: true, force: true });
    }
  });

  describe('Next.js Project Creation', () => {
    test('should create Next.js project with TypeScript, Tailwind, ESLint, and App Router', () => {
      // This test will initially FAIL as expected in TDD approach
      const projectName = 'cpaonweb-project';
      const projectPath = path.join(testProjectDir, projectName);

      // Execute the create-next-app command as documented in quickstart.md
      const createCommand = `npx create-next-app@latest ${projectName} --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes`;

      expect(() => {
        execSync(createCommand, {
          cwd: testProjectDir,
          stdio: 'pipe',
          timeout: 300000, // 5 minutes timeout for project creation
        });
      }).not.toThrow();

      // Verify project directory was created
      expect(fs.existsSync(projectPath)).toBe(true);

      // Change to project directory for subsequent tests
      process.chdir(projectPath);
    }, 300000); // 5 minutes timeout

    test('should have correct project structure', () => {
      // Verify required files exist as per Next.js with App Router
      const requiredFiles = [
        'package.json',
        'tsconfig.json',
        'next.config.js',
        'tailwind.config.ts',
        '.eslintrc.json',
        '.gitignore',
        'src/app/layout.tsx',
        'src/app/page.tsx',
        'src/app/globals.css',
      ];

      requiredFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        expect(fs.existsSync(filePath)).toBe(true);
      });

      // Verify directories exist
      const requiredDirs = [
        'src',
        'src/app',
        'public',
        'node_modules',
      ];

      requiredDirs.forEach(dir => {
        const dirPath = path.join(process.cwd(), dir);
        expect(fs.existsSync(dirPath)).toBe(true);
        expect(fs.statSync(dirPath).isDirectory()).toBe(true);
      });
    });

    test('should have correct package.json configuration', () => {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      // Verify project name
      expect(packageJson.name).toBe('cpaonweb-project');

      // Verify required scripts exist
      const requiredScripts = ['dev', 'build', 'start', 'lint'];
      requiredScripts.forEach(script => {
        expect(packageJson.scripts).toHaveProperty(script);
      });

      // Verify key dependencies are present
      const requiredDeps = ['next', 'react', 'react-dom'];
      requiredDeps.forEach(dep => {
        expect(packageJson.dependencies).toHaveProperty(dep);
      });

      // Verify TypeScript and ESLint dev dependencies
      const requiredDevDeps = ['typescript', '@types/node', '@types/react', '@types/react-dom', 'eslint'];
      requiredDevDeps.forEach(dep => {
        expect(packageJson.devDependencies).toHaveProperty(dep);
      });

      // Verify Tailwind CSS dependencies
      const tailwindDeps = ['tailwindcss', 'postcss', 'autoprefixer'];
      tailwindDeps.forEach(dep => {
        expect(packageJson.devDependencies).toHaveProperty(dep);
      });
    });

    test('should have correct TypeScript configuration', () => {
      const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

      // Verify strict mode is enabled
      expect(tsconfig.compilerOptions.strict).toBe(true);

      // Verify App Router compatibility
      expect(tsconfig.compilerOptions.target).toBeDefined();
      expect(tsconfig.compilerOptions.lib).toBeDefined();
      expect(tsconfig.compilerOptions.allowJs).toBe(true);
      expect(tsconfig.compilerOptions.skipLibCheck).toBe(true);
      expect(tsconfig.compilerOptions.esModuleInterop).toBe(true);
      expect(tsconfig.compilerOptions.allowSyntheticDefaultImports).toBe(true);

      // Verify path aliases are configured
      expect(tsconfig.compilerOptions.baseUrl).toBe('.');
      expect(tsconfig.compilerOptions.paths).toHaveProperty('@/*');

      // Verify includes and excludes
      expect(tsconfig.include).toBeDefined();
      expect(tsconfig.exclude).toContain('node_modules');
    });

    test('should have correct ESLint configuration', () => {
      const eslintrcPath = path.join(process.cwd(), '.eslintrc.json');
      const eslintrc = JSON.parse(fs.readFileSync(eslintrcPath, 'utf8'));

      // Verify Next.js ESLint configuration
      expect(eslintrc.extends).toContain('next/core-web-vitals');
    });
  });

  describe('Development Workflow Validation', () => {
    test('should pass TypeScript type checking', () => {
      // Add type-check script if not present
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      if (!packageJson.scripts['type-check']) {
        packageJson.scripts['type-check'] = 'tsc --noEmit';
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      }

      // Run type check - should pass without errors
      expect(() => {
        execSync('npm run type-check', {
          stdio: 'pipe',
          timeout: 60000, // 1 minute timeout
        });
      }).not.toThrow();
    }, 60000);

    test('should pass ESLint validation', () => {
      // Run ESLint - should pass without errors
      expect(() => {
        execSync('npm run lint', {
          stdio: 'pipe',
          timeout: 60000, // 1 minute timeout
        });
      }).not.toThrow();
    }, 60000);

    test('should build successfully', () => {
      // Run build process - should complete successfully
      expect(() => {
        execSync('npm run build', {
          stdio: 'pipe',
          timeout: 180000, // 3 minutes timeout for build
        });
      }).not.toThrow();

      // Verify .next directory was created
      const nextDir = path.join(process.cwd(), '.next');
      expect(fs.existsSync(nextDir)).toBe(true);
      expect(fs.statSync(nextDir).isDirectory()).toBe(true);

      // Verify build artifacts exist
      const buildArtifacts = ['.next/static', '.next/server'];
      buildArtifacts.forEach(artifact => {
        const artifactPath = path.join(process.cwd(), artifact);
        expect(fs.existsSync(artifactPath)).toBe(true);
      });
    }, 180000);

    test('should start development server successfully', () => {
      // This test checks if the dev server can start without immediate errors
      // We don't keep it running to avoid hanging the test suite

      let devProcess;
      try {
        const { spawn } = require('child_process');

        // Start dev server
        devProcess = spawn('npm', ['run', 'dev'], {
          stdio: 'pipe',
          detached: false,
        });

        let output = '';
        let hasStarted = false;

        // Create promise to handle async server startup
        const serverStartPromise = new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Development server failed to start within timeout'));
          }, 30000);

          devProcess.stdout.on('data', (data) => {
            output += data.toString();
            // Look for successful startup indicators
            if (output.includes('Ready') || output.includes('localhost:3000') || output.includes('Local:')) {
              hasStarted = true;
              clearTimeout(timeout);
              resolve();
            }
          });

          devProcess.stderr.on('data', (data) => {
            const errorOutput = data.toString();
            // Only reject on actual errors, not warnings
            if (errorOutput.includes('Error:') && !errorOutput.includes('Warning:')) {
              clearTimeout(timeout);
              reject(new Error(`Dev server error: ${errorOutput}`));
            }
          });

          devProcess.on('error', (error) => {
            clearTimeout(timeout);
            reject(error);
          });

          devProcess.on('exit', (code) => {
            clearTimeout(timeout);
            if (code !== 0 && !hasStarted) {
              reject(new Error(`Dev server exited with code ${code}`));
            }
          });
        });

        // Wait for server to start
        await expect(serverStartPromise).resolves.toBeUndefined();
        expect(hasStarted).toBe(true);

      } finally {
        // Clean up: kill the dev server process
        if (devProcess && !devProcess.killed) {
          devProcess.kill('SIGTERM');
          // Give it a moment to clean up
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Force kill if still running
          if (!devProcess.killed) {
            devProcess.kill('SIGKILL');
          }
        }
      }
    }, 45000);
  });

  describe('Project Configuration Validation', () => {
    test('should have correct Tailwind CSS configuration', () => {
      const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.ts');
      expect(fs.existsSync(tailwindConfigPath)).toBe(true);

      // Read and verify Tailwind config
      const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
      expect(tailwindConfig).toContain('src/app');
      expect(tailwindConfig).toContain('content:');
    });

    test('should have correct Next.js configuration', () => {
      const nextConfigPath = path.join(process.cwd(), 'next.config.js');
      expect(fs.existsSync(nextConfigPath)).toBe(true);
    });

    test('should have proper .gitignore configuration', () => {
      const gitignorePath = path.join(process.cwd(), '.gitignore');
      expect(fs.existsSync(gitignorePath)).toBe(true);

      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');

      // Verify important entries are ignored
      const expectedIgnores = ['.next/', 'node_modules/', '.env'];
      expectedIgnores.forEach(ignore => {
        expect(gitignoreContent).toContain(ignore);
      });
    });

    test('should have App Router structure with required files', () => {
      // Verify App Router specific files
      const appRouterFiles = [
        'src/app/layout.tsx',
        'src/app/page.tsx',
        'src/app/globals.css',
      ];

      appRouterFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        expect(fs.existsSync(filePath)).toBe(true);

        // Verify files are not empty
        const content = fs.readFileSync(filePath, 'utf8').trim();
        expect(content.length).toBeGreaterThan(0);
      });

      // Verify layout.tsx has proper structure
      const layoutContent = fs.readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');
      expect(layoutContent).toContain('export default function RootLayout');
      expect(layoutContent).toContain('children');

      // Verify page.tsx has proper structure
      const pageContent = fs.readFileSync(path.join(process.cwd(), 'src/app/page.tsx'), 'utf8');
      expect(pageContent).toContain('export default function');
    });
  });

  describe('Dependency Installation Validation', () => {
    test('should have node_modules directory with required packages', () => {
      const nodeModulesPath = path.join(process.cwd(), 'node_modules');
      expect(fs.existsSync(nodeModulesPath)).toBe(true);

      // Check for key dependency directories
      const keyDeps = ['next', 'react', 'react-dom', 'typescript', 'tailwindcss'];
      keyDeps.forEach(dep => {
        const depPath = path.join(nodeModulesPath, dep);
        expect(fs.existsSync(depPath)).toBe(true);
      });
    });

    test('should have package-lock.json for dependency locking', () => {
      const packageLockPath = path.join(process.cwd(), 'package-lock.json');
      expect(fs.existsSync(packageLockPath)).toBe(true);

      // Verify it's valid JSON
      expect(() => {
        JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
      }).not.toThrow();
    });
  });

  describe('Success Criteria Validation', () => {
    test('should meet all success criteria from quickstart.md step 1', () => {
      // This test summarizes all the success criteria mentioned in the quickstart guide:
      // ✅ TypeScript compilation succeeds without errors - covered by type-check test
      // ✅ Build process completes successfully - covered by build test
      // ✅ Development server starts and serves content - covered by dev server test
      // ✅ ESLint runs without errors - covered by lint test

      // Additional validation: verify all critical files are present and valid
      const criticalFiles = [
        'package.json',
        'tsconfig.json',
        'next.config.js',
        '.eslintrc.json',
        'tailwind.config.ts',
        'src/app/layout.tsx',
        'src/app/page.tsx',
      ];

      criticalFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        expect(fs.existsSync(filePath)).toBe(true);

        // Ensure files are not empty (basic content validation)
        const stat = fs.statSync(filePath);
        expect(stat.size).toBeGreaterThan(0);
      });

      // Verify this is indeed a Next.js project with proper configuration
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      expect(packageJson.dependencies).toHaveProperty('next');
      expect(packageJson.dependencies).toHaveProperty('react');
      expect(packageJson.scripts).toHaveProperty('dev');
      expect(packageJson.scripts).toHaveProperty('build');
    });
  });
});

/**
 * Test Configuration Notes:
 *
 * This integration test is designed to FAIL initially as per TDD approach.
 * It will pass only when:
 * 1. A proper Next.js TypeScript project is created
 * 2. All dependencies are correctly installed
 * 3. Configuration files are properly set up
 * 4. The build process works correctly
 * 5. TypeScript and ESLint validation passes
 *
 * To run this test:
 * npm install --save-dev jest
 * npx jest tests/integration/project-creation.test.js
 *
 * The test creates a temporary project in the system temp directory
 * and cleans up after completion to avoid polluting the workspace.
 */