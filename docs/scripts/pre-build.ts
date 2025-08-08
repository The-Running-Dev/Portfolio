import * as fs from 'fs';
import * as path from 'path';
import type { NavbarLink, Theme } from '../src/entities';
import { PreBuildConfig } from '../config/site-config';

const THEMES_DIR = path.join(__dirname, '../static/themes');
const PAGES_DIR = path.join(__dirname, '../src/pages');
const THEMES_CONFIG: string = path.join(__dirname, '../data/themes.json');
const NAVBAR_CONFIG: string = path.join(__dirname, '../data/navbarLinks.json');

export class PreBuild {
  private getThemeMetadata(file: string): Theme {
    const filePath = path.join(THEMES_DIR, file);
    const name = file.replace(/\.css$/, '');

    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Extract theme-id and theme-name from CSS header comments with improved regex
      // Handle both single-line and multi-line comments, with better whitespace handling
      const themeIdMatch = content.match(/@theme-id\s*:\s*([^\s\r\n*\/]+)/i);
      const themeNameMatch = content.match(
        /@theme-name\s*:\s*([^\r\n*]+?)(?=\r?\n|\*\/|$)/i
      );

      // Extract and validate theme ID
      let themeId = name; // Default fallback

      if (themeIdMatch) {
        const extractedId = themeIdMatch[1].trim();

        if (/^[a-zA-Z0-9-]+$/.test(extractedId)) {
          themeId = extractedId;
        } else {
          console.warn(
            `Warning: Invalid theme-id "${extractedId}" in ${file}, using filename`
          );
        }
      }

      // Extract and clean theme name
      let themeName = name.charAt(0).toUpperCase() + name.slice(1); // Default fallback

      if (themeNameMatch) {
        const extractedName = themeNameMatch[1].trim();

        if (extractedName.length > 0) {
          themeName = extractedName;
        }
      }

      return {
        name: themeId,
        displayName: themeName,
        cssFile: `themes/${file}` // Use relative path instead of absolute
      };
    } catch (error) {
      console.warn(
        `Warning: Could not Read Theme File ${file}, Using Fallback. Error: ${error instanceof Error ? `${error.message}\nStack Trace: ${error.stack}` : String(error)}`
      );

      // Use filename-based fallback (no counter needed)
      return {
        name: name,
        displayName: name.charAt(0).toUpperCase() + name.slice(1),
        cssFile: `themes/${file}` // Use relative path
      };
    }
  }

  public generateThemeConfig(): void {
    if (!fs.existsSync(THEMES_DIR)) {
      console.warn(`Themes Directory not Found: ${THEMES_DIR}`);
      return;
    }

    const cssFiles = fs
      .readdirSync(THEMES_DIR)
      .filter((f) => f.endsWith('.css'));
    const themes: Theme[] = cssFiles.map((f) => this.getThemeMetadata(f));

    // Find the default theme
    const defaultTheme =
      themes.find((t) => t.name === PreBuildConfig.DefaultTheme) || themes[0];

    // Create the JSON data structure
    const themeData = {
      themes: themes,
      defaultTheme: defaultTheme?.name || PreBuildConfig.DefaultTheme
    };

    // Write the JSON file
    fs.writeFileSync(
      THEMES_CONFIG,
      JSON.stringify(themeData, null, 2),
      'utf-8'
    );

    console.log(`✅ Theme Config Created with ${themes.length} Theme(s)`);
  }

  private copyMarkdown(): void {
    // Ensure the pages directory exists first
    if (!fs.existsSync(PAGES_DIR)) {
      fs.mkdirSync(PAGES_DIR, { recursive: true });
    }

    const mdFiles = fs
      .readdirSync(PreBuildConfig.ProjectRoot)
      .filter((f) => f.endsWith('.md'));

    mdFiles.forEach((file) => {
      const srcPath = path.join(PreBuildConfig.ProjectRoot, file);
      // Rename README.md to index.md in destination directory
      const destFile = file.toLowerCase() === 'readme.md' ? 'index.md' : file;
      const dstPath = path.join(PAGES_DIR, destFile);

      const fileExists = fs.existsSync(dstPath);

      if (!fileExists || PreBuildConfig.OverwriteExistingFiles) {
        fs.copyFileSync(srcPath, dstPath);

        const action = fileExists ? 'Overwrote' : 'Copied';

        console.log(`✅ ${action} ${file} --> src/pages/${destFile}`);
      } else {
        console.log(`ℹ️ Skipped ${file} --> src/pages/${destFile}`);
      }
    });
  }

  private generateNavbar(): void {
    const mdFiles = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.md'));
    let numberOfLinks = 0;

    // Exclude index.md (homepage) from navbar links
    const links: NavbarLink[] = mdFiles
      .filter((file) => path.parse(file).name.toLowerCase() !== 'index')
      .map((file) => {
        const name = path.parse(file).name;
        const toPath = `/${name}`;

        numberOfLinks++;

        return {
          label: file
            .replace(/\.(md|mdx)$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          to: toPath,
          position: 'left' as const
        };
      });

    // Create the JSON data structure
    const navbarData = {
      links: links
    };

    // Write the JSON file
    fs.writeFileSync(
      NAVBAR_CONFIG,
      JSON.stringify(navbarData, null, 2),
      'utf-8'
    );

    console.log(`✅ Navbar Config Created with ${numberOfLinks} Entry(s)`);
  }

  public process(): void {
    this.copyMarkdown();
    this.generateNavbar();
    this.generateThemeConfig();

    console.log('🚀 Pre Build Process Completed');
  }
}

// Only run if invoked directly, not imported
if (process.argv[1] && process.argv[1].endsWith('pre-build.ts')) {
  new PreBuild().process();
}
