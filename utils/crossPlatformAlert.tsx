import React, { useState } from 'react';
import {
  Alert as RNAlert,
  Platform,
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import Typography from '../components/Typography';

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

interface AlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

const WebAlert = ({
  isVisible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  onClose,
}: AlertOptions & { isVisible: boolean; onClose: () => void }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Typography weight="bold" style={styles.title}>
            {title}
          </Typography>
          {message && <Typography style={styles.message}>{message}</Typography>}

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === 'destructive' && styles.destructiveButton,
                  index > 0 && styles.buttonMargin,
                ]}
                onPress={() => {
                  onClose();
                  button.onPress?.();
                }}
              >
                <Typography
                  style={
                    button.style === 'destructive'
                      ? styles.destructiveText
                      : styles.buttonText
                  }
                >
                  {button.text}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

let webAlertState = {
  isVisible: false,
  title: '',
  message: '',
  buttons: [] as AlertButton[],
  onClose: () => {},
  setIsVisible: (value: boolean) => {},
};

export const WebAlertProvider = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [buttons, setButtons] = useState<AlertButton[]>([]);

  webAlertState.setIsVisible = setIsVisible;
  webAlertState.onClose = () => setIsVisible(false);
  webAlertState.title = title;
  webAlertState.message = message;
  webAlertState.buttons = buttons;
  webAlertState.isVisible = isVisible;

  if (Platform.OS === 'web') {
    return (
      <WebAlert
        isVisible={isVisible}
        title={title}
        message={message}
        buttons={buttons}
        onClose={() => setIsVisible(false)}
      />
    );
  }

  return null;
};

export const Alert = {
  alert: (title: string, message?: string, buttons?: AlertButton[]) => {
    if (Platform.OS === 'web') {
      webAlertState.title = title;
      webAlertState.message = message || '';
      webAlertState.buttons = buttons || [{ text: 'OK' }];
      webAlertState.setIsVisible(true);
    } else {
      RNAlert.alert(title, message, buttons);
    }
  },
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxWidth: 350,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 18,
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    backgroundColor: '#F5F5F5',
    minWidth: 80,
  },
  destructiveButton: {
    backgroundColor: '#FFEEEE',
  },
  buttonMargin: {
    marginLeft: 10,
  },
  buttonText: {
    color: '#0099FF',
    fontWeight: 'bold',
    textAlign: 'center',
  } as TextStyle,
  destructiveText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    textAlign: 'center',
  } as TextStyle,
});
