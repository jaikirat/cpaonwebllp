/**
 * Simple Integration Test: Repository Setup Validation
 *
 * JavaScript version for testing basic repository setup functionality
 * without TypeScript dependencies.
 */

const { execSync } = require('child_process');
const { existsSync, readFileSync } = require('fs');
const path = require('path');

describe('Repository Setup Validation (Simple)', () => {
  const projectRoot = process.cwd();

  describe('Git Repository Basic Checks', () => {
    test('should have .git directory', () => {
      const gitDir = path.join(projectRoot, '.git');
      expect(existsSync(gitDir)).toBe(true);
    });

    test('should have .gitignore file with Next.js patterns', () => {
      const gitignorePath = path.join(projectRoot, '.gitignore');
      expect(existsSync(gitignorePath)).toBe(true);

      const gitignoreContent = readFileSync(gitignorePath, 'utf-8');
      expect(gitignoreContent).toContain('node_modules');
      expect(gitignoreContent).toContain('.next');
    });

    test('should be able to run git status', () => {
      expect(() => {
        execSync('git status', {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      }).not.toThrow();
    });

    test('should be on main or master branch', () => {
      try {
        const currentBranch = execSync('git branch --show-current', {
          encoding: 'utf-8',
          cwd: projectRoot,
        }).trim();

        expect(['main', 'master']).toContain(currentBranch);
      } catch (error) {
        // If git branch --show-current fails, try alternative
        const branches = execSync('git branch', {
          encoding: 'utf-8',
          cwd: projectRoot,
        });

        expect(branches).toMatch(/\*\s+(main|master)/);
      }
    });
  });

  describe('Essential Files Check', () => {
    test('should have package.json', () => {
      const packagePath = path.join(projectRoot, 'package.json');
      expect(existsSync(packagePath)).toBe(true);
    });

    test('should have TypeScript config', () => {
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
      expect(existsSync(tsconfigPath)).toBe(true);
    });

    test('should have Next.js config', () => {
      const nextConfigPath = path.join(projectRoot, 'next.config.ts');
      expect(existsSync(nextConfigPath)).toBe(true);
    });
  });
});