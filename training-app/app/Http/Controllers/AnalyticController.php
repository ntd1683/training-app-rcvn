<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class AnalyticController extends Controller
{
    public function analytic(Request $request)
    {
        $users = User::all()->count();
        $products = Product::all()->count();
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $users,
                'total_products' => $products,
            ],
            'message' => 'Analytics data retrieved successfully.',
        ], 200);
    }
}
