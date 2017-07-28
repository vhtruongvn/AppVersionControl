export class ShareService {
  checkingAppVersion: boolean;
  failedToCheckAppVersion: boolean;
  appUpToDate: boolean;
  forceUpdate: boolean;

  appName: string;
  appVersion: string;
  appBuildNumber: string;

  // In this example, I assume ios and android app have the same version & build number
  latestAppVersion: string;
  latestAppBuildNumber: string;

  constructor() {
    this.checkingAppVersion = false;
    this.failedToCheckAppVersion = false;
    this.appUpToDate = false;
    this.forceUpdate = false;
    this.appName = '';
    this.appVersion = '';
    this.appBuildNumber = '';
    this.latestAppVersion = '';
    this.latestAppBuildNumber = '';
  }

  setCheckingAppVersion(checkingAppVersion) {
    this.checkingAppVersion = checkingAppVersion;
  }

  isCheckingAppVersion() {
    return this.checkingAppVersion;
  }

  setFailedToCheckAppVersion(failedToCheckAppVersion) {
    this.failedToCheckAppVersion = failedToCheckAppVersion;
  }

  getFailedToCheckAppVersion() {
    return this.failedToCheckAppVersion;
  }

  setAppUpToDate(appUpToDate) {
    this.appUpToDate = appUpToDate;
  }

  getAppUpToDate() {
    return this.appUpToDate;
  }

  setForceUpdate(forceUpdate) {
    this.forceUpdate = forceUpdate;
  }

  getForceUpdate() {
    return this.forceUpdate;
  }

  setAppName(appName) {
    this.appName = appName;
  }

  getAppName() {
    return this.appName;
  }

  setAppVersion(appVersion) {
    this.appVersion = appVersion
  }

  getAppVersion() {
    return this.appVersion;
  }

  getAppVersion_Integer() {
    return parseInt(this.appVersion.toString().replace(/\./g , ''))
  }

  setAppBuildNumber(appBuildNumber) {
    this.appBuildNumber = appBuildNumber
  }

  getAppBuildNumber() {
    return this.appBuildNumber;
  }

  getAppBuildNumber_Integer() {
    return parseInt(this.appBuildNumber.toString().replace(/\./g, ''))
  }

  getFullAppVersion() {
    if (this.appVersion === '' || this.appBuildNumber === '') {
      return ''
    }

    return this.appVersion + '(' + this.appBuildNumber + ')'
  }

  setLatestAppVersion(appVersion) {
    this.latestAppVersion = appVersion
  }

  getLatestAppVersion() {
    return this.latestAppVersion;
  }

  getLatestAppVersion_Integer() {
    return parseInt(this.latestAppVersion.toString().replace(/\./g , ''))
  }

  setLatestAppBuildNumber(appBuildNumber) {
    this.latestAppBuildNumber = appBuildNumber
  }

  getLatestAppBuildNumber() {
    return this.latestAppBuildNumber;
  }

  getLatestAppBuildNumber_Integer() {
    return parseInt(this.latestAppBuildNumber.toString().replace(/\./g, ''))
  }

  getFullLatestAppVersion() {
    if (this.latestAppVersion === '' || this.latestAppBuildNumber === '') {
      return ''
    }

    return this.latestAppVersion + '(' + this.latestAppBuildNumber + ')'
  }

}
