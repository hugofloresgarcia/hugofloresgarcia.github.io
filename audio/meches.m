testArray = [100 2 3 4 34 52 1 4 120];
testArrayLength = length(testArray);


testArrayMax = arrayMax(testArray, testArrayLength);

disp(testArrayMax);




function maxab = twoElementMax(a,b)
    if a>b
        maxab = a;
    else 
        maxab = b;
    end
end

function arraymax = arrayMax(array,n)
    %check to see if the array isn't actually an array
    if n == 1
        arraymax = array(1);
    else
        %compara el ultimo con el penultimo, con el penpenultimo, con el
        %penpenpenultimo asi todo pijudo como cuando tenes dos espejos
        arraymax = twoElementMax(array(n), arrayMax(array,n-1));
    end
end
        