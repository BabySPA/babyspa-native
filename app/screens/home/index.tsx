import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  Text,
  Pressable,
} from 'native-base';
import { AppStackScreenProps } from '../../types';
import Layout from './components/layout';

export default function HomeScreen({
  navigation,
}: AppStackScreenProps<'Home'>) {
  return <Layout />;
}
