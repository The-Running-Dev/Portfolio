/**
 * # Pre-Build Script for API Configuration
 *
 * This script converts YAML configuration files to JSON format for API consumption.
 * It focuses solely on configuration conversion without additional build operations.
 *
 * ## Core Functionality:
 * - Converts YAML configuration files to JSON format
 * - Creates a TypeScript index file for seamless data imports
 * - Handles missing directories and files gracefully
 *
 * ## Directory Structure:
 * - `/config/` - Source YAML configuration files
 * - `/data/` - Generated JSON data files and TypeScript index
 *
 * ## Usage:
 * - Run directly: `tsx pre-build.ts`
 * - Package.json scripts: `npm run prebuild`
 *
 * ## Dependencies:
 * - js-yaml: YAML parsing and conversion
 * - Node.js fs/path: File system operations
 *
 * @author API Build System
 * @version 2.0.0
 */

/// <reference types="node" />

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const CONFIG_DIR = path.join(__dirname, '../config');
const DATA_DIR = path.join(__dirname, '../data');

/**
 * ConfigConverter class handles YAML to JSON conversion for API configuration files.
 *
 * This simplified class focuses only on converting YAML configuration files to JSON
 * and generating a TypeScript index file for easy imports.
 */
export class ConfigConverter {
  
  constructor() {
    // Ensure directories exist
    this.ensureDirectories();
  }

  /**
   * Ensures that required directories exist
   * @private
   */
  private ensureDirectories(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        console.log(`[INFO] Creating Data Directory: ${DATA_DIR}`);
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (error) {
      console.error(
        `[ERROR] Failed to Create Data Directory: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  /**
   * Creates or updates the TypeScript index file for the data directory.
   *
   * Scans the data directory for JSON files and generates export statements
   * for each one, enabling clean imports throughout the application.
   *
   * @private
   */
  private createDataIndex(): void {
    const indexPath = path.join(DATA_DIR, 'index.ts');

    try {
      // Get all JSON files from the data directory
      const jsonFiles = fs.existsSync(DATA_DIR)
        ? fs
            .readdirSync(DATA_DIR)
            .filter((f: string) => f.endsWith('.json'))
            .sort() // Sort alphabetically for consistent output
        : [];

      if (jsonFiles.length === 0) {
        // Create empty placeholder index file if no JSON files exist
        const emptyIndexContent = '// No configuration files found\n';
        fs.writeFileSync(indexPath, emptyIndexContent, 'utf-8');
        console.log(`[INFO] Created Empty data/index.ts`);
      } else {
        // Generate export statements for each JSON file
        const exportStatements = jsonFiles.map((file: string) => {
          const baseName = path.parse(file).name;
          return `export { default as ${baseName} } from './${file}';`;
        });

        const indexContent = exportStatements.join('\n') + '\n';
        fs.writeFileSync(indexPath, indexContent, 'utf-8');
        console.log(
          `[INFO] Created data/index.ts with ${jsonFiles.length} JSON export(s)`
        );
      }
    } catch (error) {
      console.error(
        `[ERROR] Failed to Create Data Index: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Converts all YAML files in the config directory to JSON format.
   *
   * Processes each .yml and .yaml file found in the config directory,
   * converts them to JSON, and saves them in the data directory.
   *
   * @private
   */
  private processYamlToJson(): void {
    if (!fs.existsSync(CONFIG_DIR)) {
      console.warn(`[WARN] Config Directory Not Found: ${CONFIG_DIR}`);
      return;
    }

    const yamlFiles = fs
      .readdirSync(CONFIG_DIR)
      .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));

    if (yamlFiles.length === 0) {
      console.warn(`[WARN] No YAML Files Found in ${CONFIG_DIR}`);
      return;
    }

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

        // Write JSON file
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8');

        console.log(`[INFO] Converted ${file} --> data/${jsonFileName}`);
        processedCount++;
      } catch (error) {
        console.error(
          `[ERROR] Failed to Process ${file}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });

    console.log(
      `[INFO] YAML to JSON Conversion Completed: ${processedCount} File(s) Processed`
    );
  }

  /**
   * Main processing method that converts YAML files to JSON and creates the index file.
   *
   * @public
   */
  public process(): void {
    try {
      console.log('[INFO] Starting YAML to JSON Conversion Process...');
      
      this.processYamlToJson();
      this.createDataIndex();

      console.log('[INFO] YAML to JSON Conversion Process Completed Successfully');
    } catch (error) {
      console.error(
        `[ERROR] YAML to JSON Conversion Process Failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }
}

// Only run if invoked directly, not imported
if (process.argv[1] && process.argv[1].endsWith('pre-build.ts')) {
  new ConfigConverter().process();
}

/**
 * ## Script Summary:
 *
 * This simplified pre-build script focuses solely on converting YAML configuration
 * files to JSON format for API consumption.
 *
 * ### Key Capabilities:
 * - **Configuration Conversion**: YAML to JSON conversion with error handling
 * - **Data Management**: TypeScript-compatible index generation
 * - **Error Handling**: Graceful handling of missing files and directories
 *
 * ### Reliability Features:
 * - Handles missing directories by creating them
 * - Continues processing even if individual files fail
 * - Detailed logging for debugging and monitoring
 * - Clean error messages and warnings
 *
 * ## Status: [READY] Simplified and focused on YAML to JSON conversion only
 */
