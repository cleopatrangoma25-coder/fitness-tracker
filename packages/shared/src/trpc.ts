// Define the router type that can be shared between client and server
export interface AppRouter {
  user: {
    getProfile: {
      query: () => Promise<any>
    }
    updateProfile: {
      mutation: (input: any) => Promise<any>
    }
  }
  workout: {
    create: {
      mutation: (input: any) => Promise<any>
    }
    list: {
      query: (input?: any) => Promise<any>
    }
    getById: {
      query: (input: any) => Promise<any>
    }
    delete: {
      mutation: (input: any) => Promise<any>
    }
  }
  goal: {
    create: {
      mutation: (input: any) => Promise<any>
    }
    listActive: {
      query: () => Promise<any>
    }
    updateProgress: {
      mutation: (input: any) => Promise<any>
    }
  }
}

// Export the router type
export type RouterType = AppRouter 