import React, {useState, useEffect} from 'react'
import PageFallback1 from './PageFallback1';
import { useToast } from './contexts/ToastContext';
import ComingSoon from './svgs/ComingSoon';

const Sections = () => {
    const {setToast} = useToast();
    const [isLocalDataReady, setIsLocalDataReady] = useState(true);

  return (
<>
{isLocalDataReady ? 
  <div className="flex items-center justify-center pt-16 xl:pt-0">
      <ComingSoon className="w-9/12 xl:w-8/12"/>
    </div> :
<PageFallback1/> 
}
</>
  )
}

export default Sections