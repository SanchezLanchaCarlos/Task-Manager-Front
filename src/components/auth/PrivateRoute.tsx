import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: Props) {
  const { token } = useAuth();

  return token ? <>{children}</> : <Navigate to="/login" />;
}
