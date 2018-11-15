// Copyright (c) 2018 Spotify AB.
// 
// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
// 
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
import { render as tsRenderer } from './tsgen';
import { render as javaRenderer } from './javagen';
import { render as cppRenderer } from './cppgen';
import { render as docRenderer } from './docgen';
import { render as swiftRenderer } from './swiftgen';
import { render as pythonRenderer } from './pythongen';
import { ensureDependencies } from './buildDependencies';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import * as mkdirp from 'mkdirp';
import { resolve, dirname, relative } from 'path';
import { ContractDef } from './defs.generated';
import * as program from 'commander';
import { OutputFile, Renderer } from './interfaces';
import { validate } from './validation';
import { Result } from 'option-t/cjs/Result';
import { execSync } from 'child_process';
import { asList } from './utils';
import * as findUp from 'find-up';

// Maps language names to renderers.
const renderers: Map<string, Renderer> = new Map();
renderers.set('typescript', tsRenderer);
renderers.set('java', javaRenderer);
renderers.set('cpp', cppRenderer);
renderers.set('doc', docRenderer);
renderers.set('swift', swiftRenderer);
renderers.set('python', pythonRenderer);

// CLI.
program.version(String(process.env.npm_package_version));

program.option(
  '-l, --lang [name]',
  'Sets the output language',
  new RegExp([...renderers.keys()].join('|'), 'i'),
  'typescript'
);

program.option(
  '-s, --score [path]',
  'Sets the score schema',
  '../../score-schema.json'
);

program.option(
  '-i --input [path]',
  'Sets the input file to use',
  '../../smart-player-contract.json'
);

program.option(
  '-o --output [dir]',
  'Sets the source output directory, stdout if absent'
);

program.parse(process.argv);

/**
 * Main process. Selects a renderer based on the `lang` arg and outputs generated files.
 */
async function main() {
  const lang = String(program.lang).toLowerCase();
  const renderer = renderers.get(lang);
  // This should always be set since there's a default option.
  if (renderer) {
    // Download binary dependencies if they haven't been already.
    await ensureDependencies();
    const input = resolve(program.input);
    const schema: ContractDef = JSON.parse(readFileSync(input).toString());
    expect(validate(schema), 'contractDef is invalid');
    const score = resolve(program.score);
    const scoreSchema: any = JSON.parse(readFileSync(score).toString());
    console.log(`Generating ${lang}...`);
    const outputFiles = await renderer(schema, scoreSchema);
    if (program.output) {
      const outputPaths = writeFiles(outputFiles);
      if (lang === 'java') {
        prettyJava(outputPaths);
        const pomPath = await findUp('pom.xml', { cwd: program.output });
        if (pomPath) {
          javaLicenseHeaders(dirname(pomPath));
        }
      }
      else if (lang === 'swift') {
        prettySwift(outputPaths);
      }
      else if (lang === 'python') {
        prettyPython(outputPaths);
      }
    } else {
      console.log(outputFiles.map(f => f.content).join('\n'));
    }
  } else {
    throw new Error(`No renderer found for language "${lang}"`);
  }
}

/**
 * Writes the given list of output file objects (`{ filepath, content }`) to disk.
 */
function writeFiles(files: OutputFile[]): string[] {
  const outputPaths = [];
  for (const file of files) {
    const outputPath = resolve(program.output, file.filepath);
    const outputDir = dirname(outputPath);
    if (!existsSync(outputDir)) {
      mkdirp.sync(outputDir);
    }
    writeFileSync(outputPath, file.content);
    console.log(`Saved: ${relative(__dirname, outputPath)}`);
    outputPaths.push(outputPath);
  }
  return outputPaths;
}

/**
 * Like .expect, but includes the underlying cause.
 */
function expect<T>(result: Result<T, Error>, message: string) {
  if (result.isErr()) {
    const error: Error = result.unwrapErr();
    error.message = `${message}\nCaused by: ${error.message}`;
    throw error;
  }
}

function javaLicenseHeaders(pomPath: string): void {
  execSync(`mvn license:update-file-header`, { cwd: pomPath });
}

function prettyJava(paths: string[]): void {
  execSync(
    `java -jar ./libs/google-java-format-1.5-all-deps.jar -i ${paths.join(' ')}`
  );
}

function prettySwift(paths: string[]): void {
  execSync(
    paths.map(path => `./libs/swiftlint autocorrect --path ${path}`).join(';')
  );
}

function prettyPython(paths: string[]): void {
  execSync(
    `PYTHONPATH=./libs/yapf-0.22.0 python3 ./libs/yapf-0.22.0/yapf -i ${paths.join(' ')}`
  );
}

// Run.
main();
