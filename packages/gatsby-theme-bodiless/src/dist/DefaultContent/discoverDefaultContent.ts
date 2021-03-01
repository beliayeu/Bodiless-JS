/**
 * Copyright © 2021 Johnson & Johnson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import path from 'path';
import fg from 'fast-glob';
import fs from 'fs';
import util from 'util';

const fsReadFile = util.promisify(fs.readFile);
 
const discoverDefaultContent = async (depth = 1) => {
  let dir = path.resolve(process.cwd());
  let currentDepth = depth;
  let defaultContentPaths: string[] = [];
  const patterns = [];
  while (currentDepth > 0 && dir !== path.resolve(dir, '..')) {
    patterns.push(
      `${dir}/bodiless.content.json`,
      `${dir}/node_modules/**/bodiless.content.json`,
    );
    currentDepth -= 1;
    dir = path.resolve(dir, '..');
  }

  const stream = fg.stream(patterns);
  for await (const file of stream) {
    try {
      const rawContent = await fsReadFile(file);
      const objectContent = JSON.parse(rawContent.toString()) as string[];
      defaultContentPaths = [
        ...defaultContentPaths,
        ...objectContent.map(file$ => path.resolve(path.dirname(file as string), file$)),
      ];
    } catch(e) {
      console.error(`@bodiless/gatsby-theme-bodiless: Error on reading and parsing file: ${file}. Error: ${e}`)
    }
  }
  return defaultContentPaths;
};

export default discoverDefaultContent;
