import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

import { GlobalConfig } from '../src/entities';
import type { Theme } from '../src/components/ThemeSwitcher';
import type { CustomNavBarLink } from '../src/components/NavBarLinks';

const THEMES_DIR = path.join(__dirname, '../static/themes');
const PAGES_DIR = path.join(__dirname, '../src/pages');
const DEMOS_DIR = path.join(__dirname, '../src/pages/demos');
const CONFIG_DIR = path.join(__dirname, '../config');
const DATA_DIR = path.join(__dirname, '../data');
const THEMES_CONFIG: string = path.join(__dirname, '../data/Themes.json');
const NAVBAR_CONFIG: string = path.join(__dirname, '../data/NavBarLinks.json');

export class PreBuild {
  private config: GlobalConfig;

  constructor() {
    // Create data directory and index first to avoid import errors
    this.createDataIndex();

    this.setupConfig();

    this.config = this.loadConfig();
  }

  private createDataIndex(): void {
    const indexPath = path.join(DATA_DIR, 'index.ts');

    try {
      // Ensure data directory exists
      if (!fs.existsSync(DATA_DIR)) {
        console.log(`📁 Creating Data Directory: ${DATA_DIR}`);

        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      // Get all JSON files from the data directory
      const jsonFiles = fs.existsSync(DATA_DIR) 
        ? fs.readdirSync(DATA_DIR)
            .filter((f: string) => f.endsWith('.json'))
            .sort() // Sort alphabetically for consistent output
        : [];

      if (jsonFiles.length === 0) {
        // Create empty placeholder index file if no JSON files exist
        const emptyIndexContent = '// Empty index - will be populated after YAML conversion\n';
        
        fs.writeFileSync(indexPath, emptyIndexContent, 'utf-8');
        
        console.log(`✅ Created Placeholder data/index.ts`);
      } else {
        // Generate export statements for each JSON file
        const exportStatements = jsonFiles.map((file: string) => {
          const baseName = path.parse(file).name;

          return `export { default as ${baseName} } from './${file}';`;
        });

        const indexContent = exportStatements.join('\n') + '\n';
        
        fs.writeFileSync(indexPath, indexContent, 'utf-8');
        
        console.log(`✅ Created data/index.ts with ${jsonFiles.length} JSON export(s)`);
      }
    } catch (error) {
      console.error(`❌ Failed to Create Data Index: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private setupConfig(): void {
    try {
      const yamlConfigPath = path.join(CONFIG_DIR, 'globalConfig.yml');
      const jsonConfigPath = path.join(DATA_DIR, 'globalConfig.json');

      if (!fs.existsSync(yamlConfigPath)) {
        console.warn(`⚠️ GlobalConfig.yml not Found at ${yamlConfigPath}`);
        
        return;
      }

      // Ensure data directory exists
      if (!fs.existsSync(DATA_DIR)) {
        console.log(`📁 Creating Data Directory: ${DATA_DIR}`);

        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      // Read and convert YAML to JSON
      const yamlContent = fs.readFileSync(yamlConfigPath, 'utf-8');
      const configData = yaml.load(yamlContent) as any;
      
      // Write JSON file
      fs.writeFileSync(jsonConfigPath, JSON.stringify(configData, null, 2), 'utf-8');

      console.log(`✅ Converted GlobalConfig.yml to GlobalConfig.json`);
      
    } catch (error) {
      console.error(`❌ Failed to Convert GlobalConfig.yml: ${error instanceof Error ? error.message : String(error)}`);
      
      throw error;
    }
  }
  
  private getThemeMetadata(file: string): Theme {
    const filePath = path.join(THEMES_DIR, file);
    const name = file.replace(/\.css$/, '');

    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Extract theme-id and theme-name from CSS header comments with improved regex
      // Handle both single-line and multi-line comments, with better whitespace handling
      const themeIdMatch = content.match(
        /@theme-id\s*:\s*([^\s\r\n*/]{1,50})/i
      );
      const themeNameMatch = content.match(
        /@theme-name\s*:\s*([^\r\n*]{1,100})/i
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
      themes.find((t) => t.name === this.config.preBuild?.defaultTheme) || themes[0];

    // Create the JSON data structure
    const themeData = {
      themes: themes,
      defaultTheme: defaultTheme?.name || this.config.preBuild?.defaultTheme
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
    if (!this.config.preBuild?.copyMarkdownFromProjectRoot) {
      return;
    }

    // Ensure the pages directory exists first
    if (!fs.existsSync(PAGES_DIR)) {
      fs.mkdirSync(PAGES_DIR, { recursive: true });
    }

    const mdFiles = fs
      .readdirSync(this.config.preBuild?.projectRoot)
      .filter((f) => f.endsWith('.md'));

    mdFiles.forEach((file) => {
      const srcPath = path.join(this.config.preBuild?.projectRoot, file);
      // Rename README.md to index.md in destination directory
      const destFile = file.toLowerCase() === 'readme.md' ? 'index.md' : file;
      const dstPath = path.join(PAGES_DIR, destFile);

      const fileExists = fs.existsSync(dstPath);

      if (!fileExists || this.config.preBuild?.overwriteExistingFiles) {
        fs.copyFileSync(srcPath, dstPath);

        const action = fileExists ? 'Overwrote' : 'Copied';

        console.log(`✅ ${action} ${file} --> src/pages/${destFile}`);
      } else {
        console.log(`ℹ️ Skipped ${file} --> src/pages/${destFile}`);
      }
    });
  }

  private generateNavbar(): void {
    if (!this.config.preBuild?.generateNavBarForPages) {
      return;
    }

    const mdFiles = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.md'));
    let numberOfLinks = 0;

    // Exclude index.md (homepage) from navbar links
    const links: CustomNavBarLink[] = mdFiles
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
          href: toPath,
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

  static updateNavbarLinks() {
    const demoFiles = fs.readdirSync(DEMOS_DIR).filter((f) => f.endsWith('.tsx'));
    const links = demoFiles.map((file) => {
      const name = file.replace(/\.tsx$/, '');
      let label = name
        .replace(/-/g, ' ')
        .replace(/(^| )\w/g, (s) => s.toUpperCase())
        .replace('Config', 'Config')
        .replace('Theme', 'Theme')
        .replace('Configuration', 'Configuration');

      // Remove 'Demo' suffix if it exists, we'll handle this in the label formatting
      label = label.replace(/ Demo$/, '');

      return {
        label,
        href: `/demos/${name}`,
        position: "left",
        title: "",
        icon: ""
      };
    });

    const navbarConfig = {
      dropdown: false,
      dropdownLabel: "Demos",
      className: "",
      showIcons: true,
      links: links
    };

    fs.writeFileSync(NAVBAR_CONFIG, JSON.stringify(navbarConfig, null, 2));
  }

  private processYamlToJson(): void {
    // Ensure the data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(CONFIG_DIR)) {
      console.warn(`Config Directory not Found: ${CONFIG_DIR}`);

      return;
    }

    const yamlFiles = fs
      .readdirSync(CONFIG_DIR)
      .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));

    let processedCount = 0;

    yamlFiles.forEach((file) => {
      try {
        const yamlPath = path.join(CONFIG_DIR, file);
        const yamlContent = fs.readFileSync(yamlPath, 'utf-8');

        // Parse YAML to JavaScript object
        const jsonData = yaml.load(yamlContent);

        // Generate JSON filename (replace .yml/.yaml with .json)
        const jsonFileName = file.replace(/\.(yml|yaml)$/, '.json');
        const jsonPath = path.join(DATA_DIR, jsonFileName);

        // Write JSON file (overwrite if exists)
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');

        console.log(`✅ Converted ${file} --> data/${jsonFileName}`);
        processedCount++;

      } catch (error) {
        console.error(`❌ Failed to Process ${file}: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    console.log(`✅ YAML to JSON Conversion Completed: ${processedCount} File(s) Processed`);

    // Create the index.ts file after YAML processing
    this.createDataIndex();
  }

  private loadConfig(): GlobalConfig {
    try {
      // Read the fresh GlobalConfig.json file directly
      const globalConfigPath = path.join(DATA_DIR, 'GlobalConfig.json');
      const globalConfigContent = fs.readFileSync(globalConfigPath, 'utf-8');
      const configData = JSON.parse(globalConfigContent);

      return configData as GlobalConfig;
    } catch (error) {
      console.error(`❌ Failed to Load Config: ${error instanceof Error ? error.message : String(error)}`);
      
      throw error;
    }
  }

  public process(): void {
    this.processYamlToJson();
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