import { View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Typography } from '@atoms/Typography';
import { Card } from '@atoms/Card';
import type { EcoService } from '@/types';

// ─── ServiceCard Molecule ─────────────────────────────────────────────────────
/**
 * ServiceCard — displays a single EcoService as a tappable card.
 *
 * AI Prompt: "Add a sustainability score badge to this ServiceCard molecule.
 * Display it as a green pill in the top-right corner of the image."
 *
 * Layer: Molecule (composes Typography + Card atoms)
 *
 * @example
 * <ServiceCard service={ecoService} onPress={() => router.push(`/service/${ecoService.id}`)} />
 */

interface ServiceCardProps {
  service:  EcoService;
  onPress?: () => void;
}

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} accessibilityRole="button">
      <Card className="overflow-hidden p-0">
        {/* Cover Image */}
        <Image
          source={{ uri: service.imageUrl }}
          style={{ width: '100%', height: 160 }}
          contentFit="cover"
          transition={300}
        />
        {/* Content */}
        <View className="p-3">
          <View className="flex-row justify-between items-start">
            <Typography variant="h3" className="flex-1 mr-2">{service.name}</Typography>
            {service.isVerified && (
              <View className="badge-eco">
                <Typography variant="caption" className="text-primary-400">✓ Verified</Typography>
              </View>
            )}
          </View>
          <Typography variant="caption" className="mt-1" numberOfLines={2}>
            {service.description}
          </Typography>
          <View className="flex-row items-center mt-2">
            <Typography variant="caption" className="text-warning">
              ★ {service.rating.toFixed(1)}
            </Typography>
            <Typography variant="caption" className="ml-2">
              ({service.reviewCount} reviews)
            </Typography>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
