let configData = {
    development: {
        DashboardRoute: "http://localhost:3001",
        ApiUrl: "http://localhost:5000",
        
      },
      test: {
        DashboardRoute: "http://localhost:3001",
        ApiUrl: "http://139.59.59.189:81"
      },
      production: {
        DashboardRoute: "http://paperbirdadmin.expolyst.com",
          ApiUrl: "http://prosesindia.in/paperbirdapi"
      }
    }
  
    export default  function (env) {
      return configData[env]
    }