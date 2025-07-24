import React from 'react';
import { Card, Button, VStack } from '@fitness-tracker/ui';

export function TrpcExample() {
  return (
    <Card className="p-6">
      <VStack spacing="lg">
        <h3 className="text-xl font-bold">tRPC Debug</h3>
        <p className="text-gray-600">tRPC integration is configured and ready to use.</p>
        <Button variant="outline">Test tRPC Connection</Button>
      </VStack>
    </Card>
  );
} 