import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeartHandshake, Lightbulb, Users, Shield } from "lucide-react";

export default function WhyFundamenta() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6">Why Fundamenta?</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-primary" />
            Your Life Skills Partner
          </CardTitle>
          <CardDescription>
            Empowering young adults with essential life skills and knowledge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold">Smart Learning</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI-powered personalized guidance adapts to your learning style and needs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Community Support</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join a community of learners sharing experiences and knowledge
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">Safe Learning Environment</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Private, secure, and judgment-free space to learn and grow
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
