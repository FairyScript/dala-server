import * as YAML from 'yaml'
import * as fs from 'fs'
import { Config } from './types/config'

const testConfig = fs.readFileSync('./temp/config.yml', 'utf-8')
export const config: Config = YAML.parse(testConfig)
