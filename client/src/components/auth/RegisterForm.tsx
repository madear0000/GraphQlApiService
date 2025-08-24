import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { REGISTER } from '../../graphql/mutations';
import { RegisterData } from '../../types';
import { useAuthStore } from '../../store/authStore';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateRegister } from '../../utils/validation';

const defaultIcons = [
  '😀', '😊', '😎', '🤩', '😍', '🥰', '😋', '😜', '🤗', '😇',
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'
];

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    password: '',
    icon: ''
  });
  const [errors, setErrors] = useState<Partial<RegisterData>>({});
  
  const login = useAuthStore((state) => state.login);
  const [registerMutation, { loading, error }] = useMutation(REGISTER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleIconSelect = (icon: string) => {
    setFormData(prev => ({ ...prev, icon }));
    if (errors.icon) {
      setErrors(prev => ({ ...prev, icon: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateRegister(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { data } = await registerMutation({
        variables: formData
      });

      if (data.register) {
        login(data.register.token, data.register.user);
        onSuccess?.();
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        required
      />
      
      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose an icon
        </label>
        <div className="grid grid-cols-5 gap-2">
          {defaultIcons.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => handleIconSelect(icon)}
              className={`text-2xl p-2 rounded-md transition-colors ${
                formData.icon === icon
                  ? 'bg-indigo-100 border-2 border-indigo-500'
                  : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
        {errors.icon && <p className="mt-1 text-sm text-red-500">{errors.icon}</p>}
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error.message}
        </div>
      )}
      
      <Button
        type="submit"
        loading={loading}
        className="w-full"
      >
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;