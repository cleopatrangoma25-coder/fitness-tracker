# Shadcn UI Components Documentation

This document provides comprehensive documentation for all the shadcn/ui components available in the Fitness Tracker Pro application.

## 📦 Available Components

### Core Components

#### Button
A versatile button component with multiple variants and states.

```tsx
import { Button } from '@fitness-tracker/ui'

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With loading state
<Button loading>Loading...</Button>

// With icons
<Button leftIcon={<Icon />}>With Left Icon</Button>
<Button rightIcon={<Icon />}>With Right Icon</Button>
```

#### Input
A form input component with validation support.

```tsx
import { Input } from '@fitness-tracker/ui'

// Basic usage
<Input placeholder="Enter text" />

// With label and error
<Input 
  label="Email"
  type="email"
  placeholder="Enter your email"
  error="Please enter a valid email"
/>

// Different types
<Input type="text" placeholder="Text input" />
<Input type="email" placeholder="Email input" />
<Input type="password" placeholder="Password input" />
<Input type="number" placeholder="Number input" />
```

#### Card
A container component for grouping related content.

```tsx
import { Card, Card.Header, Card.Content, Card.Footer } from '@fitness-tracker/ui'

// Basic usage
<Card>
  <div>Card content</div>
</Card>

// With header, content, and footer
<Card>
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Content>
    <p>Card content goes here</p>
  </Card.Content>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>

// Variants
<Card variant="default">Default Card</Card>
<Card variant="outlined">Outlined Card</Card>
```

### New Components

#### Dialog
A modal dialog component for overlays and popups.

```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@fitness-tracker/ui'

const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this workout?
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4">
      {/* Dialog content */}
    </div>
    
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={() => setOpen(false)}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Table
A data table component for displaying structured information.

```tsx
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@fitness-tracker/ui'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Workout</TableHead>
      <TableHead>Duration</TableHead>
      <TableHead>Calories</TableHead>
      <TableHead>Date</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {workouts.map((workout) => (
      <TableRow key={workout.id}>
        <TableCell className="font-medium">{workout.name}</TableCell>
        <TableCell>{workout.duration}</TableCell>
        <TableCell>{workout.calories}</TableCell>
        <TableCell>{workout.date}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Tabs
A tabbed interface component for organizing content.

```tsx
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@fitness-tracker/ui'

const [activeTab, setActiveTab] = useState('workouts')

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="workouts">Workouts</TabsTrigger>
    <TabsTrigger value="goals">Goals</TabsTrigger>
    <TabsTrigger value="profile">Profile</TabsTrigger>
  </TabsList>
  
  <TabsContent value="workouts">
    <div>Workout content</div>
  </TabsContent>
  
  <TabsContent value="goals">
    <div>Goals content</div>
  </TabsContent>
  
  <TabsContent value="profile">
    <div>Profile content</div>
  </TabsContent>
</Tabs>
```

#### Checkbox
A checkbox input component with label support.

```tsx
import { Checkbox } from '@fitness-tracker/ui'

// Basic usage
<Checkbox id="terms" />

// With label and description
<Checkbox 
  id="goal1" 
  label="Complete 5 workouts this week"
  description="Stay consistent with your fitness routine"
/>

// With error state
<Checkbox 
  id="goal2" 
  label="Lose 2kg this month"
  error="This goal is too aggressive"
/>
```

#### Alert
A notification component for displaying messages to users.

```tsx
import { Alert, AlertTitle, AlertDescription } from '@fitness-tracker/ui'

// Different variants
<Alert variant="default">
  <AlertTitle>Info</AlertTitle>
  <AlertDescription>This is an informational message.</AlertDescription>
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
```

#### Textarea
A multi-line text input component.

```tsx
import { Textarea } from '@fitness-tracker/ui'

// Basic usage
<Textarea placeholder="Enter your notes..." />

// With label and helper text
<Textarea 
  label="Workout Notes"
  placeholder="How did you feel? Any achievements?"
  helperText="Optional notes about your workout session"
/>

// With error state
<Textarea 
  label="Bio"
  error="Bio must be at least 10 characters long"
/>
```

### Utility Components

#### Badge
A small status indicator component.

```tsx
import { Badge } from '@fitness-tracker/ui'

// Variants
<Badge>Default</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="warning">In Progress</Badge>
<Badge variant="destructive">Failed</Badge>
```

#### Progress
A progress bar component for showing completion status.

```tsx
import { Progress } from '@fitness-tracker/ui'

// Basic usage
<Progress value={75} />

// With custom styling
<Progress value={60} className="w-full h-2" />
```

#### Loading
A loading spinner component.

```tsx
import { Loading } from '@fitness-tracker/ui'

// Basic usage
<Loading />

// With text
<Loading text="Loading workouts..." />

// Different sizes
<Loading size="sm" />
<Loading size="md" />
<Loading size="lg" />
```

#### EmptyState
A component for displaying empty states.

```tsx
import { EmptyState } from '@fitness-tracker/ui'

<EmptyState 
  title="No workouts yet"
  description="Start your fitness journey by logging your first workout"
  action={<Button>Add Workout</Button>}
/>
```

## 🎨 Styling and Theming

All components use Tailwind CSS classes and follow the shadcn/ui design system. The components are built with:

- **Consistent spacing**: Using Tailwind's spacing scale
- **Color system**: Primary, secondary, accent, and semantic colors
- **Typography**: Consistent font sizes and weights
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Responsive design**: Mobile-first approach

## 🔧 Customization

### Using the `cn` utility
The `cn` utility function combines class names and handles conflicts:

```tsx
import { cn } from '@fitness-tracker/ui'

<Button className={cn(
  "custom-class",
  isActive && "bg-blue-500",
  isDisabled && "opacity-50"
)}>
  Custom Button
</Button>
```

### Extending components
You can extend any component by passing additional props:

```tsx
<Button 
  variant="primary"
  size="lg"
  className="w-full md:w-auto"
  onClick={handleClick}
  disabled={isLoading}
>
  {isLoading ? 'Loading...' : 'Save Workout'}
</Button>
```

## 📱 Responsive Design

All components are responsive by default:

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>

// Responsive table
<div className="overflow-x-auto">
  <Table>
    {/* Table content */}
  </Table>
</div>
```

## ♿ Accessibility

All components include proper accessibility features:

- **Keyboard navigation**: All interactive elements are keyboard accessible
- **Screen readers**: Proper ARIA labels and roles
- **Focus management**: Visible focus indicators
- **Color contrast**: Meets WCAG guidelines

## 🧪 Testing

Components can be tested using the provided test utilities:

```tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@fitness-tracker/ui'

test('renders button with correct text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
})
```

## 📚 Examples

See the `ShadcnExample` component in `apps/web/src/components/examples/ShadcnExample.tsx` for a comprehensive demonstration of all components in a fitness tracker context.

## 🚀 Best Practices

1. **Consistent usage**: Use the same variants and sizes throughout your app
2. **Semantic meaning**: Choose variants that match the content's meaning
3. **Accessibility**: Always provide proper labels and descriptions
4. **Performance**: Use React.memo for components that don't need frequent updates
5. **Testing**: Write tests for component behavior and accessibility

## 🔗 Related Documentation

- [Technical Design Document](technical-design-doc.md)
- [Production Readiness Guide](PRODUCTION_READINESS.md)
- [User Guide](USER_GUIDE.md)
- [API Documentation](API_DOCS.md)

---

**Last Updated**: December 2024
**Version**: 1.0.0 