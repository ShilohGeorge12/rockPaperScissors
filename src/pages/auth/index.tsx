import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/authContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export const AuthPage = () => {
	const { login, register } = useAuth();
	const navigate = useNavigate();
	const [isLogin, setIsLogin] = useState(true);
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (isLogin) {
				await login(email, password);
				toast.success('Welcome back!');
				navigate('/');
			} else {
				if (!username.trim()) {
					toast.error('Username is required');
					setLoading(false);
					return;
				}
				await register(username, email, password);
				toast.success('Account created!');
				navigate('/');
			}
		} catch (err: any) {
			toast.error(err.message || 'Authentication failed');
		} finally {
			setLoading(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className='relative w-full max-w-md mx-auto min-h-screen flex flex-col px-4 py-8'
			style={{ background: 'var(--bg-primary)' }}>

			{/* Back button */}
			<button
				onClick={() => navigate('/')}
				className='self-start mb-6 flex items-center gap-1 px-3 py-1.5 glass rounded-xl text-sm font-bold'
				style={{ color: 'var(--text-secondary)' }}>
				← Back
			</button>

			{/* Header */}
			<div className='text-center mb-8'>
				<h1 className='text-3xl font-display font-bold' style={{ color: 'var(--text-primary)' }}>
					{isLogin ? 'Welcome Back' : 'Create Account'}
				</h1>
				<p className='mt-2 text-sm' style={{ color: 'var(--text-muted)' }}>
					{isLogin ? 'Sign in to continue' : 'Join the arena'}
				</p>
			</div>

			{/* Tabs */}
			<div className='flex mb-6 p-1 rounded-xl' style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
				<button
					onClick={() => setIsLogin(true)}
					className='flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200'
					style={{
						background: isLogin ? 'var(--accent-primary)' : 'transparent',
						color: isLogin ? '#fff' : 'var(--text-muted)',
					}}>
					Login
				</button>
				<button
					onClick={() => setIsLogin(false)}
					className='flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200'
					style={{
						background: !isLogin ? 'var(--accent-primary)' : 'transparent',
						color: !isLogin ? '#fff' : 'var(--text-muted)',
					}}>
					Register
				</button>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				{!isLogin && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}>
						<Input
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder='Choose a username'
							label='Username'
						/>
					</motion.div>
				)}

				<Input
					type='email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder='Enter your email'
					required
					label='Email'
				/>

				<Input
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder='Enter your password'
					required
					minLength={6}
					label='Password'
				/>

				<Button
					type='submit'
					disabled={loading}
					size='lg'
					className='w-full mt-2'>
					{loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
				</Button>
			</form>

			{/* Skip link */}
			<button
				onClick={() => navigate('/')}
				className='mt-6 text-center text-sm font-medium'
				style={{ color: 'var(--text-muted)' }}>
				Skip for now →
			</button>
		</motion.div>
	);
};
