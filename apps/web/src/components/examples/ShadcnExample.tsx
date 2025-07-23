import React, { useState } from 'react'
import {
  Button,
  Card,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Checkbox,
  Alert,
  AlertTitle,
  AlertDescription,
  Badge,
  Progress,
  Textarea
} from '@fitness-tracker/ui'

export function ShadcnExample() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('workouts')
  const [showAlert, setShowAlert] = useState(true)

  // Mock data for the table
  const workouts = [
    { id: 1, name: 'Morning Cardio', duration: '30 min', calories: 250, date: '2024-01-15' },
    { id: 2, name: 'Strength Training', duration: '45 min', calories: 320, date: '2024-01-14' },
    { id: 3, name: 'Yoga Session', duration: '60 min', calories: 180, date: '2024-01-13' },
  ]

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Shadcn UI Components Demo</h1>
      
      {/* Alert Component */}
      {showAlert && (
        <Alert variant="success">
          <AlertTitle>Welcome to Fitness Tracker!</AlertTitle>
          <AlertDescription>
            This is a demonstration of the new shadcn/ui components integrated into your fitness tracker.
          </AlertDescription>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowAlert(false)}
            className="absolute top-2 right-2"
          >
            ×
          </Button>
        </Alert>
      )}

      {/* Tabs Component */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="workouts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Workouts</h3>
              <Button onClick={() => setDialogOpen(true)}>
                Add Workout
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workout</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Calories</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell className="font-medium">{workout.name}</TableCell>
                    <TableCell>{workout.duration}</TableCell>
                    <TableCell>{workout.calories}</TableCell>
                    <TableCell>{workout.date}</TableCell>
                    <TableCell>
                      <Badge variant="success">Completed</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="goals" className="space-y-4">
            <h3 className="text-lg font-semibold">Fitness Goals</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Weekly Workouts</span>
                  <span className="text-sm text-gray-500">3/5</span>
                </div>
                <Progress value={60} className="w-full" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Weight Goal</span>
                  <span className="text-sm text-gray-500">75kg / 70kg</span>
                </div>
                <Progress value={80} className="w-full" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Checkbox 
                id="goal1" 
                label="Complete 5 workouts this week"
                description="Stay consistent with your fitness routine"
              />
              <Checkbox 
                id="goal2" 
                label="Lose 2kg this month"
                description="Healthy weight loss target"
              />
              <Checkbox 
                id="goal3" 
                label="Improve running distance"
                description="Increase from 5km to 10km"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4">
            <h3 className="text-lg font-semibold">Profile Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                defaultValue="John Doe"
              />
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                defaultValue="john@example.com"
              />
              <Input
                label="Age"
                type="number"
                placeholder="Enter your age"
                defaultValue="28"
              />
              <Input
                label="Weight (kg)"
                type="number"
                placeholder="Enter your weight"
                defaultValue="75"
              />
            </div>
            
            <Textarea
              label="Bio"
              placeholder="Tell us about your fitness journey..."
              defaultValue="I'm passionate about staying fit and healthy. My goal is to maintain a consistent workout routine and improve my overall fitness level."
            />
            
            <div className="flex gap-2">
              <Button variant="primary">Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Dialog Component */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Workout</DialogTitle>
            <DialogDescription>
              Log your workout session to track your fitness progress.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Input
              label="Workout Name"
              placeholder="e.g., Morning Cardio, Strength Training"
            />
            <Input
              label="Duration (minutes)"
              type="number"
              placeholder="30"
            />
            <Input
              label="Calories Burned"
              type="number"
              placeholder="250"
            />
            <Textarea
              label="Notes"
              placeholder="How did you feel? Any achievements?"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>
              Save Workout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Component Showcase */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Component Variants</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Button Variants</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Alert Variants</h4>
            <div className="space-y-2">
              <Alert variant="default">
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>This is a default alert message.</AlertDescription>
              </Alert>
              <Alert variant="success">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Your workout has been saved successfully!</AlertDescription>
              </Alert>
              <Alert variant="warning">
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>You haven't worked out in 3 days.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to save workout. Please try again.</AlertDescription>
              </Alert>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Badge Variants</h4>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="success">Completed</Badge>
              <Badge variant="warning">In Progress</Badge>
              <Badge variant="destructive">Failed</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 