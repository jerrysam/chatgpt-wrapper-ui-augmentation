export interface ChatMessage {
  content: string
  role: ChatRole
  augmentation?: Augmentation
}

export interface Persona {
  id?: string
  role: ChatRole
  avatar?: string
  name?: string
  prompt?: string
  key?: string
  isDefault?: boolean
}

export interface Chat {
  id: string
  persona?: Persona
  messages?: ChatMessage[]
  augmentation?: Augmentation
}

export type ChatRole = 'assistant' | 'user' | 'system'

export type Augmentation = {
  augmentation: 'response-button'
  data: {
    'buttonText': string
    'responseText': string
  }
} | {
  augmentation: 'animation'
  data: 'Yes' | 'No' | 'Excitement' | 'Success'
} | {
  augmentation: 'chart'
  data: {
    type: 'Pie' | 'Line' | 'Bar' | 'Doughnut' | 'PolarArea' | 'Radar' | 'Scatter' | 'Bubble';
    data: {
      labels: [string]
      datasets: [{
        label: string
        data: any
        fill: boolean
      }]
    }
    options?: any
  }
} | {
  augmentation: 'none'
}