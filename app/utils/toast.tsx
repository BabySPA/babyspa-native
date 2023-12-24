import { Toast } from 'react-native-toast-notifications';

export function toastAlert(
  toast: typeof Toast,
  type: 'info' | 'warning' | 'success' | 'error',
  text: string | JSX.Element,
) {
  const _types = {
    info: 'normal',
    warning: 'warning',
    success: 'success',
    error: 'danger',
  };
  toast.show(text, {
    type: _types[type] || 'normal',
    duration: 3000,
  });
}
