import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const steps = ['Confirmed', 'Preparing', 'On the Way'];

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStep(1), 2000);
    const t2 = setTimeout(() => setCurrentStep(2), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!order) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }}>
          <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-6" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Order Placed!</h1>
          <p className="font-body text-muted-foreground mb-1">Order {order.orderNumber}</p>
          <p className="font-body text-sm text-muted-foreground mb-8">Estimated delivery: 25-35 minutes</p>
        </motion.div>

        {/* Status tracker */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-8">
          <div className="flex items-center justify-between max-w-xs mx-auto">
            {steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={{ scale: currentStep >= i ? 1 : 0.7, backgroundColor: currentStep >= i ? 'hsl(var(--primary))' : 'hsl(var(--muted))' }}
                  transition={{ delay: 0.2 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
                >
                  {currentStep >= i ? '✓' : i + 1}
                </motion.div>
                <span className={`font-body text-xs ${currentStep >= i ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>{step}</span>
              </div>
            ))}
          </div>
          <div className="flex max-w-[180px] mx-auto mt-[-20px] mb-[-8px]">
            {[0, 1].map(i => (
              <div key={i} className="flex-1 h-0.5 mt-[20px]">
                <motion.div animate={{ width: currentStep > i ? '100%' : '0%' }} className="h-full bg-primary rounded-full" />
              </div>
            ))}
          </div>
        </motion.div>

        <button onClick={() => navigate('/')} className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-body font-semibold hover:bg-primary-dark transition-colors">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
