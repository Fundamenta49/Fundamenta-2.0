import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HandshakeIcon, Building, GraduationCap, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Partner() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6">Partner With Us</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HandshakeIcon className="h-6 w-6 text-primary" />
            Join Our Mission
          </CardTitle>
          <CardDescription>
            Help us empower the next generation with essential life skills
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Organizations</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Partner with us to provide life skills training to your community
                </p>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">Educators</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Join our network of experts and share your knowledge
                </p>
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold">Supporters</h3>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Support our mission to make life skills education accessible
                </p>
                <Button variant="outline" className="w-full">
                  Support Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
