export const reducer = (state, action) => {
    switch (action.type) {
      case 'GET_PROPERTIES':
        return { ...state, ...action.payload };
    
      default:
        throw new Error(`Unknown action: ${action.type}`);
    }
  };