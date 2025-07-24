import React from 'react';
import { Card, Button, Input, VStack, HStack } from '@fitness-tracker/ui';

export function ShadcnExample() {
  return (
    <Card className="p-6">
      <VStack spacing="lg">
        <h3 className="text-xl font-bold">Shadcn UI Components Demo</h3>
        
        <HStack spacing="md" className="flex-wrap">
          <Button variant="default">Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </HStack>
        
        <VStack spacing="sm">
          <Input label="Example Input" placeholder="Type something..." />
          <Input label="Email" type="email" placeholder="email@example.com" />
        </VStack>
      </VStack>
    </Card>
  );
} 