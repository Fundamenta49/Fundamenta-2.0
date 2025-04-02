import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge"; // Added import for Badge
import { useToast } from "@/hooks/use-toast";
import { FitnessProfile } from "./fitness-profile";
import FitnessPlan from "./fitness-plan";

interface ProfileManagerProps {
  onUpdate: (profile: FitnessProfile) => void;
}

// Convert cm to feet and inches
const cmToFeetInches = (cm: number) => {
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  return { feet, inches: remainingInches };
};

// Convert kg to lbs
const kgToLbs = (kg: number) => Math.round(kg * 2.20462);

export default function ProfileManager({ onUpdate }: ProfileManagerProps) {
  const { toast } = useToast();
  const [profile, setProfile] = useState<FitnessProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    heightFeet: "",
    heightInches: "",
    weightLbs: "",
    sex: "",
    fitnessLevel: "",
    goals: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fitnessGoals = [
    "Weight Loss",
    "Muscle Gain",
    "Endurance",
    "Flexibility",
    "General Fitness",
    "Stress Reduction"
  ];

  useEffect(() => {
    // Load existing profile data
    const savedProfile = localStorage.getItem('fitnessProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        const { feet, inches } = cmToFeetInches(profile.height);
        const weightLbs = kgToLbs(profile.weight);

        setProfile(profile);
        setFormData({
          heightFeet: feet.toString(),
          heightInches: inches.toString(),
          weightLbs: weightLbs.toString(),
          sex: profile.sex,
          fitnessLevel: profile.fitnessLevel,
          goals: profile.goals
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation with more specific messages
      const missingFields = [];
      if (!formData.heightFeet.trim()) missingFields.push("Height (feet)");
      if (!formData.heightInches.trim()) missingFields.push("Height (inches)");
      if (!formData.weightLbs.trim()) missingFields.push("Weight");
      if (!formData.sex) missingFields.push("Sex");
      if (!formData.fitnessLevel) missingFields.push("Fitness Level");

      if (missingFields.length > 0) {
        toast({
          variant: "destructive",
          title: "Please Fill All Fields",
          description: `Missing required information: ${missingFields.join(", ")}`,
        });
        return;
      }

      const heightCm = (Number(formData.heightFeet) * 12 + Number(formData.heightInches)) * 2.54;
      const weightKg = Number(formData.weightLbs) * 0.453592;

      if (isNaN(heightCm) || isNaN(weightKg)) {
        toast({
          variant: "destructive",
          title: "Invalid Numbers",
          description: "Please enter valid numbers for height and weight.",
        });
        return;
      }

      const updatedProfile: FitnessProfile = {
        height: heightCm,
        weight: weightKg,
        sex: formData.sex as "male" | "female",
        fitnessLevel: formData.fitnessLevel as "beginner" | "intermediate" | "advanced",
        goals: formData.goals.length > 0 ? formData.goals : ["General Fitness"],
      };

      onUpdate(updatedProfile);
      setProfile(updatedProfile);
      setIsEditingProfile(false);

      toast({
        title: "Success!",
        description: "Your fitness profile has been updated successfully!",
      });

    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditingProfile && profile) {
    return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Fitness Profile 💪</CardTitle>
                <CardDescription>View your current fitness information and personalized plan</CardDescription>
              </div>
              <Button onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div>
                <h3 className="font-semibold mb-2">Current Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Height</Label>
                    <p className="text-lg">{cmToFeetInches(profile.height).feet}' {cmToFeetInches(profile.height).inches}"</p>
                  </div>
                  <div>
                    <Label>Weight</Label>
                    <p className="text-lg">{Math.round(kgToLbs(profile.weight))} lbs</p>
                  </div>
                  <div>
                    <Label>Fitness Level</Label>
                    <p className="text-lg capitalize">{profile.fitnessLevel}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Your Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.goals.map((goal) => (
                    <Badge key={goal} variant="secondary">{goal}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <FitnessPlan profile={profile} />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{profile ? "Update Your Fitness Profile" : "Create Your Fitness Profile"}</CardTitle>
        <CardDescription>
          {profile ? "Keep your profile up to date as your fitness journey progresses" : "Let's create your personalized fitness profile"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Height (required)</Label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label>Feet</Label>
                  <Input
                    type="number"
                    min="1"
                    max="8"
                    value={formData.heightFeet}
                    onChange={(e) => handleInputChange("heightFeet", e.target.value)}
                    className="text-lg"
                    required
                  />
                </div>
                <div className="flex-1">
                  <Label>Inches</Label>
                  <Input
                    type="number"
                    min="0"
                    max="11"
                    value={formData.heightInches}
                    onChange={(e) => handleInputChange("heightInches", e.target.value)}
                    className="text-lg"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Weight (lbs) (required)</Label>
              <Input
                type="number"
                value={formData.weightLbs}
                onChange={(e) => handleInputChange("weightLbs", e.target.value)}
                className="text-lg"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sex (required)</Label>
            <select
              className="w-full h-10 px-3 py-2 text-lg border rounded-md bg-background"
              value={formData.sex}
              onChange={(e) => handleInputChange("sex", e.target.value)}
              required
            >
              <option value="">Select your sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Fitness Level (required)</Label>
            <select
              className="w-full h-10 px-3 py-2 text-lg border rounded-md bg-background"
              value={formData.fitnessLevel}
              onChange={(e) => handleInputChange("fitnessLevel", e.target.value)}
              required
            >
              <option value="">Select your fitness level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Fitness Goals (Select multiple)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {fitnessGoals.map((goal) => (
                <Button
                  key={goal}
                  type="button"
                  variant={formData.goals.includes(goal) ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => toggleGoal(goal)}
                >
                  {goal}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            {isEditingProfile && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingProfile(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Saving..." : (profile ? "Save Changes" : "Create Profile")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}