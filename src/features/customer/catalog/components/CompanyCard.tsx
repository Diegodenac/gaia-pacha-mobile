import { View, Image, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Company } from '../types';
import { Card } from '../../../../components/atoms/Card';
import { Typography } from '../../../../components/atoms/Typography';

interface CompanyCardProps {
  company: Company;
  onPress: (companyId: string) => void;
}

export function CompanyCard({ company, onPress }: CompanyCardProps) {
  return (
    <TouchableOpacity onPress={() => onPress(company.id)} activeOpacity={0.8} className="mb-4">
      <Card elevated className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden p-0 border border-gray-100 dark:border-gray-700">
        <Image 
          source={{ uri: company.image }} 
          className="w-full h-40"
          resizeMode="cover"
        />
        
        {/* Eco Indicator Badge */}
        <View className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded-full flex-row items-center shadow-sm">
          <Ionicons 
            name="leaf" 
            size={14} 
            color={
              company.ecoIndicator === 'high' ? '#10B981' : 
              company.ecoIndicator === 'medium' ? '#F59E0B' : '#EF4444'
            } 
            className="mr-1"
          />
          <Text className="text-xs font-bold text-gray-800 dark:text-gray-200">
            {company.ecoScore.toFixed(1)}
          </Text>
        </View>

        <View className="p-4">
          <View className="flex-row justify-between items-start mb-1">
            <Typography variant="h3" className="text-gray-900 dark:text-white flex-1">
              {company.name}
            </Typography>
            <View className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md ml-2">
              <Text className="text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                {company.category.name}
              </Text>
            </View>
          </View>
          
          <Typography variant="bodySmall" className="text-gray-600 dark:text-gray-400 mb-3" numberOfLines={2}>
            {company.description}
          </Typography>

          <View className="flex-row items-center mb-3">
            <Ionicons name="location" size={14} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              {company.location}
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {company.tags.slice(0, 3).map((tag) => (
              <View key={tag.id} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                <Text className="text-[10px] text-gray-600 dark:text-gray-300">
                  {tag.name}
                </Text>
              </View>
            ))}
            {company.tags.length > 3 && (
              <View className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                <Text className="text-[10px] text-gray-600 dark:text-gray-300">
                  +{company.tags.length - 3}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
