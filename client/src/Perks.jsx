import React from 'react'



const Perks = ({selected,onChange}) => {
  function handlecbClick(ev){
    const {checked,name} = ev.target;
    if(checked){
      onChange([...selected,name]);
    }
    else{
      onChange([...selected.filter(selectedName=>selectedName!=name)]);
    }
    
    
  }

  return (
    <div>

    
                  <label className="flex items-center space-x-2 text-blue-600">
                    <input type="checkbox" checked={selected.includes('Certiciate')} name='Certiciate' onChange={handlecbClick} className="form-checkbox h-5 w-5 text-blue-500" />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.980 3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                      />
                    </svg>
                    <span>Certiciate</span>
                  </label>
                  
          </div>
               
  )
}

export default Perks