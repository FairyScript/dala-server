//只提取了感兴趣的信息
export interface Plugin {
  Name: string
  Author: string
  InternalName: string
  AssemblyVersion: string
  RepoUrl: string
  DalamudApiLevel: number
  LastUpdated: string
}

export type Repo = Plugin[]
