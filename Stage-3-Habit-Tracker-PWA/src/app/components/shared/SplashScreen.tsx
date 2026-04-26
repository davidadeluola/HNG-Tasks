import { APP_NAME } from "../../lib/constants";

export function SplashScreen() {
  return (
    <div className="screen-center" data-testid="splash-screen">
      <h1 className="splash-title">{APP_NAME}</h1>
      <p className="splash-subtitle">Building consistency one day at a time.</p>
    </div>
  );
}
