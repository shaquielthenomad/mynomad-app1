import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Loader2, Server, Cloud, Download, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeploymentStep {
  name: string;
  status: "pending" | "processing" | "completed" | "error";
  description: string;
}

export function ExportWizard() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<"local" | "cloud">("local");
  const { toast } = useToast();
  const [steps, setSteps] = useState<DeploymentStep[]>([]);

  const localSteps: DeploymentStep[] = [
    {
      name: "Generate Configuration",
      status: "pending",
      description: "Creating necessary configuration files",
    },
    {
      name: "Export Database",
      status: "pending",
      description: "Exporting database schema and data",
    },
    {
      name: "Package Application",
      status: "pending",
      description: "Packaging application files",
    },
    {
      name: "Generate Instructions",
      status: "pending",
      description: "Creating deployment instructions",
    },
  ];

  const cloudSteps: DeploymentStep[] = [
    {
      name: "Verify Configuration",
      status: "pending",
      description: "Checking Google Cloud configuration",
    },
    {
      name: "Build Container",
      status: "pending",
      description: "Building Docker container",
    },
    {
      name: "Push to Registry",
      status: "pending",
      description: "Pushing to Google Container Registry",
    },
    {
      name: "Deploy to Cloud Run",
      status: "pending",
      description: "Deploying to Google Cloud Run",
    },
  ];

  const startDeployment = async () => {
    setIsDeploying(true);
    setDownloadUrl(null);
    setSteps(selectedOption === "local" ? localSteps : cloudSteps);

    try {
      const response = await fetch(`/api/deploy/${selectedOption}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      if (data.success) {
        // Set the download URL if it's available
        if (data.downloadUrl) {
          setDownloadUrl(data.downloadUrl);
        }

        toast({
          title: "Deployment Successful",
          description: `Your application has been ${
            selectedOption === "local" ? "exported" : "deployed"
          } successfully.`,
        });

        // Update steps to show completion
        setSteps(prev => prev.map(step => ({ ...step, status: "completed" })));
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Deployment Failed",
        description: error.message || "An error occurred during deployment",
      });

      // Update steps to show error
      setSteps(prev => prev.map(step => 
        step.status === "processing" ? { ...step, status: "error" } : step
      ));
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.location.href = downloadUrl;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export & Deploy</CardTitle>
        <CardDescription>
          Choose how you want to deploy your MyNomad application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="local"
          value={selectedOption}
          onValueChange={(value) => setSelectedOption(value as "local" | "cloud")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="local" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Local Server
            </TabsTrigger>
            <TabsTrigger value="cloud" className="flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Google Cloud
            </TabsTrigger>
          </TabsList>

          <TabsContent value="local">
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will create a deployable package for your local server
                  including all necessary configuration files and instructions.
                </AlertDescription>
              </Alert>

              {steps.length > 0 && (
                <div className="space-y-4 mt-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      {step.status === "completed" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : step.status === "processing" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : step.status === "error" ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{step.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Button
                  onClick={startDeployment}
                  disabled={isDeploying}
                  className="w-full"
                >
                  {isDeploying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export for Local Server
                    </>
                  )}
                </Button>

                {downloadUrl && (
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Export Package
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cloud">
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will deploy your application to Google Cloud Run with
                  automatic scaling and HTTPS.
                </AlertDescription>
              </Alert>

              {steps.length > 0 && (
                <div className="space-y-4 mt-4">
                  {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-4">
                      {step.status === "completed" ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : step.status === "processing" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : step.status === "error" ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{step.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={startDeployment}
                disabled={isDeploying}
                className="w-full"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Cloud className="mr-2 h-4 w-4" />
                    Deploy to Google Cloud
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}