function pca(X) {
    /*
        Return matrix of all principle components as column vectors
    */        
    var m = X.length;
    var sigma = numeric.div(numeric.dot(numeric.transpose(X), X), m);
    return numeric.svd(sigma).U;
}

function pcaReduce(U, k) {
    /*
        Return matrix of k first principle components as column vectors            
    */                
    return U.map(function(row) {
        return row.slice(0, k)
    });
}

function pcaProject(X, Ureduce) {
    /*
        Project matrix X onto reduced principle components matrix
    */
    return numeric.dot(X, Ureduce);
}

function pcaRecover(Z, Ureduce) {
    /*
        Recover matrix from projection onto reduced principle components
    */
    return numeric.dot(Z, numeric.transpose(Ureduce));
}
