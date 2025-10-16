import { ThemeProvider } from '../ThemeProvider';

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-8 space-y-4">
        <h2 className="text-2xl font-bold">Theme Provider Example</h2>
        <p className="text-muted-foreground">
          This provider manages theme switching across the application.
          Use the navigation in the header to switch between themes.
        </p>
      </div>
    </ThemeProvider>
  );
}
