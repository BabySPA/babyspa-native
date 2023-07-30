import { AppStackScreenProps } from '../../types';
import Layout from './components/layout';

export default function HomeScreen({
  navigation,
}: AppStackScreenProps<'Home'>) {
  return <Layout />;
}
