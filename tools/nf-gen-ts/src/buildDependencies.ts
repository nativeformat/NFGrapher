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
// tslint:disable:no-var-requires
const { buildDependencies } = require('../package.json');
import * as extract from 'extract-zip';
import * as request from 'request';
import * as mkdirp from 'mkdirp';
import * as path from 'path';
import * as fs from 'fs';
import { map } from 'lodash';

const RE_ZIP = /\.zip$/i;

export async function ensureDependencies() {
  return Promise.all(
    map(buildDependencies, async (url: string, name: string) => {
      const dest = path.resolve(__dirname, '../libs', name);
      return maybeDownload(url, dest);
    })
  );
}

async function maybeDownload(url: string, dest: string) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dest)) {
      console.log(`Downloading: ${path.basename(dest)}...`);
      const isZip = RE_ZIP.test(url);
      const dir = path.dirname(dest);
      mkdirp(dir, error => {
        if (error) {
          reject(error);
        } else {
          const file = fs.createWriteStream(dest);
          file.on('close', () => {
            if (isZip) {
              const tmp = path.join(dir, '__tmp.zip');
              fs.renameSync(dest, tmp);
              extract(tmp, { dir }, error => {
                if (error) {
                  reject(error);
                } else {
                  fs.unlinkSync(tmp);
                  resolve();
                }
              });
            } else {
              resolve();
            }
          });
          request(url).pipe(file);
        }
      });
    } else {
      resolve();
    }
  });
}
