class Logger {
  static instance = null;

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message, data) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  error(message, error) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
    if (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  }

  debug(message, data) {
    if (process.env.DEBUG === 'true') {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
      if (data) {
        console.log(JSON.stringify(data, null, 2));
      }
    }
  }

  warn(message, data) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
    if (data) {
      console.warn(JSON.stringify(data, null, 2));
    }
  }
}

export { Logger };